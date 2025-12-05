from rest_framework import serializers
from .models import Listing, ListingImage, Category, Favorite
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug')


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ('id', 'image', 'is_primary')


class ListingSerializer(serializers.ModelSerializer):
    images = ListingImageSerializer(many=True, read_only=True)
    seller = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    is_favorited = serializers.SerializerMethodField()
    # Add images_data field for write operations (update)
    images_data = serializers.ListField(
        child=serializers.CharField(allow_blank=True),
        write_only=True,
        required=False,
        allow_null=True,
        allow_empty=True
    )

    class Meta:
        model = Listing
        fields = (
            'id', 'title', 'description', 'price', 'category', 'category_id',
            'location', 'seller', 'status', 'images', 'images_data', 'is_favorited',
            'condition', 'is_featured', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'seller', 'status', 'created_at', 'updated_at')
        extra_kwargs = {
            'title': {'required': False},
            'description': {'required': False},
            'price': {'required': False},
            'location': {'required': False},
        }

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, listing=obj).exists()
        return False

    def validate(self, attrs):
        """Validate data before update"""
        # Ensure attrs is a dict (it should always be from DRF)
        if not isinstance(attrs, dict):
            raise serializers.ValidationError({'non_field_errors': ['Invalid data format']})
        return attrs

    def create(self, validated_data):
        category_id = validated_data.pop('category_id', None)
        listing = Listing.objects.create(**validated_data)
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
                listing.category = category
                listing.save()
            except Category.DoesNotExist:
                pass
        return listing

    def update(self, instance, validated_data):
        # validated_data should always be a dict from DRF, but check just in case
        if not isinstance(validated_data, dict):
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f'Invalid validated_data type: {type(validated_data)}, value: {validated_data}')
            raise serializers.ValidationError({'non_field_errors': ['Invalid data format']})
        
        # Handle images separately (can come as 'images' or 'images_data')
        images_data = None
        if 'images_data' in validated_data:
            images_data = validated_data.pop('images_data')
        elif 'images' in validated_data:
            images_data = validated_data.pop('images')
        
        # Ensure images_data is a list if provided
        if images_data is not None and not isinstance(images_data, list):
            images_data = [images_data] if images_data else []
        
        category_id = validated_data.pop('category_id', None)
        
        # Handle price conversion
        price = validated_data.get('price')
        if price is not None:
            try:
                from decimal import Decimal
                if isinstance(price, str):
                    price_decimal = Decimal(price)
                    if price_decimal <= 0:
                        raise serializers.ValidationError({'price': 'Price must be greater than 0'})
                    validated_data['price'] = price_decimal
                elif isinstance(price, (int, float)):
                    if price <= 0:
                        raise serializers.ValidationError({'price': 'Price must be greater than 0'})
                    validated_data['price'] = Decimal(str(price))
            except (ValueError, TypeError) as e:
                raise serializers.ValidationError({'price': f'Invalid price format: {price}. Must be a number.'})
        
        # Update basic fields (excluding images which we handle separately)
        for attr, value in validated_data.items():
            if attr not in ['images', 'images_data']:
                try:
                    # Don't set None values for required fields
                    if value is not None:
                        setattr(instance, attr, value)
                except Exception as e:
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.warning(f'Failed to set {attr} on listing {instance.id}: {e}')
        
        # Update category if provided
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
                instance.category = category
            except Category.DoesNotExist:
                raise serializers.ValidationError({'category_id': f'Invalid category ID: {category_id}'})
        
        # Save the instance
        try:
            instance.save()
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f'Failed to save listing {instance.id}: {e}', exc_info=True)
            # Get the actual error message
            error_msg = str(e)
            if 'not iterable' in error_msg:
                error_msg = 'Invalid data format. Please check all fields are correct.'
            raise serializers.ValidationError({'non_field_errors': [f'Failed to save listing: {error_msg}']})
        
        # Update images if provided
        if images_data is not None:
            try:
                # Delete existing images
                instance.images.all().delete()
                # Create new images if list is not empty
                if isinstance(images_data, list) and len(images_data) > 0:
                    for idx, image_url in enumerate(images_data):
                        if image_url:
                            try:
                                ListingImage.objects.create(
                                    listing=instance,
                                    image=str(image_url),  # Ensure it's a string
                                    is_primary=(idx == 0)
                                )
                            except Exception as e:
                                import logging
                                logger = logging.getLogger(__name__)
                                logger.warning(f'Failed to create image {idx} for listing {instance.id}: {e}')
            except Exception as e:
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f'Failed to update images for listing {instance.id}: {e}', exc_info=True)
                # Don't fail the whole update if images fail, just log it
        
        return instance


class ListingCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.CharField(),  # Accept any string (URL, base64, or local path)
        write_only=True,
        required=False
    )
    condition = serializers.ChoiceField(
        choices=Listing.CONDITION_CHOICES,
        required=False,
        default='good'
    )

    class Meta:
        model = Listing
        fields = ('title', 'description', 'price', 'category_id', 'location', 'images', 'condition')
    
    category_id = serializers.IntegerField(required=True, allow_null=False)

    def validate(self, attrs):
        # Validate required fields
        if not attrs.get('category_id'):
            raise serializers.ValidationError({'category_id': 'Category is required'})
        return attrs

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        category_id = validated_data.pop('category_id', None)
        
        # Validate category exists
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
            except Category.DoesNotExist:
                raise serializers.ValidationError({'category_id': f'Invalid category ID: {category_id}'})
        else:
            raise serializers.ValidationError({'category_id': 'Category is required'})
        
        # Ensure price is valid
        price = validated_data.get('price')
        if not price:
            raise serializers.ValidationError({'price': 'Price is required'})
        
        try:
            # Convert to Decimal if it's a string
            from decimal import Decimal
            if isinstance(price, str):
                price_decimal = Decimal(price)
                if price_decimal <= 0:
                    raise serializers.ValidationError({'price': 'Price must be greater than 0'})
                validated_data['price'] = price_decimal
            elif isinstance(price, (int, float)):
                if price <= 0:
                    raise serializers.ValidationError({'price': 'Price must be greater than 0'})
                validated_data['price'] = Decimal(str(price))
        except (ValueError, TypeError) as e:
            raise serializers.ValidationError({'price': f'Invalid price format: {price}. Must be a number.'})
        
        # Ensure condition has a default if not provided
        if 'condition' not in validated_data or not validated_data.get('condition'):
            validated_data['condition'] = 'good'
        
        # Auto-approve listings for development (in production, you might want admin approval)
        listing = Listing.objects.create(**validated_data, category=category, status='approved')
        
        # Create image records
        for idx, image_url in enumerate(images_data):
            if image_url:  # Only create if image URL is not empty
                try:
                    # TextField can store base64 data URIs, URLs, or any string
                    # Base64 format: data:image/jpeg;base64,/9j/4AAQ...
                    # URL format: https://...
                    # Store as-is (TextField accepts any string)
                    ListingImage.objects.create(
                        listing=listing,
                        image=image_url,  # Can be base64, URL, or any string
                        is_primary=(idx == 0)
                    )
                except Exception as e:
                    # Log the full error to understand what's happening
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f'Failed to create image {idx} for listing {listing.id}: {e}', exc_info=True)
                    # Continue with other images even if one fails
        
        return listing


class FavoriteSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'listing', 'created_at')
        read_only_fields = ('id', 'created_at')

