from rest_framework import serializers
from .models import Notification
from listings.serializers import ListingSerializer


class NotificationSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ('id', 'notification_type', 'title', 'message', 'listing', 'is_read', 'created_at')
        read_only_fields = ('id', 'created_at')


