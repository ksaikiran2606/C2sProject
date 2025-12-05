from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db import models
from django_filters.rest_framework import DjangoFilterBackend
from .models import Listing, Category, Favorite, ListingImage
from .serializers import (
    ListingSerializer, CategorySerializer, FavoriteSerializer,
    ListingCreateSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None  # Disable pagination for categories
    permission_classes = [AllowAny]  # Allow anyone to view categories


class ListingViewSet(viewsets.ModelViewSet):
    # Base queryset - shows approved listings for public, but get_queryset() will override for authenticated users
    queryset = Listing.objects.filter(status='approved').select_related('seller', 'category').prefetch_related('images')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'location', 'status', 'condition', 'is_featured']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['price', 'created_at', '-price', '-created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return ListingCreateSerializer
        return ListingSerializer
    
    def update(self, request, *args, **kwargs):
        """Override update to add better error handling and logging"""
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            # Log the incoming data for debugging
            logger.info(f'Update request for listing {kwargs.get("pk")}: {request.data}')
            
            # Get the instance first
            instance = self.get_object()
            # Use partial=True to allow partial updates (not all fields required)
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            
            if serializer.is_valid(raise_exception=False):
                self.perform_update(serializer)
                if getattr(instance, '_prefetched_objects_cache', None):
                    instance._prefetched_objects_cache = {}
                return Response(serializer.data)
            else:
                # Log detailed validation errors
                logger.error(f'Serializer validation failed for listing {kwargs.get("pk")}')
                logger.error(f'Request data: {request.data}')
                logger.error(f'Validation errors: {serializer.errors}')
                # Return detailed error response
                return Response({
                    'errors': serializer.errors,
                    'message': 'Validation failed. Please check the errors below.',
                    'received_data': request.data
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f'Error updating listing {kwargs.get("pk")}: {e}', exc_info=True)
            # Re-raise to let DRF handle it properly
            raise

    def get_permissions(self):
        """
        Allow anyone to view listings, but require authentication to create/update/delete
        """
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        """
        Return listings based on user permissions:
        - Staff: See all listings
        - Authenticated users: See approved listings + their own listings (even if pending)
        - Anonymous: See only approved listings
        """
        if self.request.user.is_authenticated and self.request.user.is_staff:
            # Staff can see everything
            return Listing.objects.all().select_related('seller', 'category').prefetch_related('images')
        elif self.request.user.is_authenticated:
            # Authenticated users see approved listings + their own listings
            return Listing.objects.filter(
                models.Q(status='approved') | models.Q(seller=self.request.user)
            ).select_related('seller', 'category').prefetch_related('images')
        else:
            # Anonymous users see only approved listings
            return Listing.objects.filter(status='approved').select_related('seller', 'category').prefetch_related('images')
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
    
    def perform_update(self, serializer):
        # Ensure only the owner can update their listing
        if serializer.instance.seller != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only update your own listings.")
        try:
            serializer.save()
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f'Error in perform_update for listing {serializer.instance.id}: {e}', exc_info=True)
            raise

    @action(detail=True, methods=['post', 'delete'], permission_classes=[IsAuthenticated])
    def favorite(self, request, pk=None):
        listing = self.get_object()
        favorite, created = Favorite.objects.get_or_create(user=request.user, listing=listing)
        
        if request.method == 'DELETE':
            favorite.delete()
            return Response({'message': 'Removed from favorites'}, status=status.HTTP_200_OK)
        
        if not created:
            return Response({'message': 'Already in favorites'}, status=status.HTTP_200_OK)
        
        return Response({'message': 'Added to favorites'}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_listings(self, request):
        listings = Listing.objects.filter(seller=request.user)
        serializer = self.get_serializer(listings, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def favorites(self, request):
        favorites = Favorite.objects.filter(user=request.user).select_related('listing')
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def similar(self, request, pk=None):
        """Get similar listings (same category, exclude current listing)"""
        listing = self.get_object()
        similar = Listing.objects.filter(
            category=listing.category,
            status='approved'
        ).exclude(id=listing.id).select_related('seller', 'category').prefetch_related('images')[:6]
        serializer = self.get_serializer(similar, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def report(self, request, pk=None):
        """Report a listing for inappropriate content"""
        listing = self.get_object()
        reason = request.data.get('reason', 'Inappropriate content')
        # In a real app, you'd save this to a Report model
        # For now, just return success
        return Response({
            'message': 'Listing reported successfully. Our team will review it.',
            'listing_id': listing.id
        }, status=status.HTTP_200_OK)

