"""
Script to create a Django superuser non-interactively
Run: python create_superuser.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'marketplace.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Default superuser credentials
username = 'admin'
email = 'admin@marketplace.com'
password = 'admin123'

if User.objects.filter(username=username).exists():
    print(f'Superuser "{username}" already exists.')
else:
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'Superuser "{username}" created successfully!')
    print(f'Username: {username}')
    print(f'Password: {password}')
    print('\nIMPORTANT: Change the password after first login!')

