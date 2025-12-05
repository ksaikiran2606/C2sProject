from django.db.models.signals import post_save
from django.dispatch import receiver
from listings.models import Listing
from .models import Notification
import firebase_admin
from firebase_admin import credentials, messaging
import os
from django.conf import settings


@receiver(post_save, sender=Listing)
def notify_listing_status_change(sender, instance, created, **kwargs):
    if not created and 'status' in kwargs.get('update_fields', []):
        if instance.status == 'approved':
            Notification.objects.create(
                user=instance.seller,
                notification_type='approval',
                title='Listing Approved',
                message=f'Your listing "{instance.title}" has been approved.',
                listing=instance
            )
            send_fcm_notification(
                instance.seller,
                'Listing Approved',
                f'Your listing "{instance.title}" has been approved.'
            )
        elif instance.status == 'rejected':
            Notification.objects.create(
                user=instance.seller,
                notification_type='rejection',
                title='Listing Rejected',
                message=f'Your listing "{instance.title}" has been rejected.',
                listing=instance
            )
            send_fcm_notification(
                instance.seller,
                'Listing Rejected',
                f'Your listing "{instance.title}" has been rejected.'
            )


def send_fcm_notification(user, title, body):
    if not user.fcm_token:
        return
    
    try:
        if not firebase_admin._apps:
            cred_path = settings.FIREBASE_CREDENTIALS_PATH
            if cred_path and os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
            else:
                return
        
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            token=user.fcm_token,
        )
        messaging.send(message)
    except Exception as e:
        print(f"FCM notification error: {e}")


