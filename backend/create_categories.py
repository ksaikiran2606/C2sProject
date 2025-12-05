#!/usr/bin/env python
"""
Script to create default categories for the marketplace
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'marketplace.settings')
django.setup()

from listings.models import Category

def create_default_categories():
    categories = [
        {'name': 'Electronics', 'slug': 'electronics'},
        {'name': 'Furniture', 'slug': 'furniture'},
        {'name': 'Vehicles', 'slug': 'vehicles'},
        {'name': 'Clothing', 'slug': 'clothing'},
        {'name': 'Books', 'slug': 'books'},
        {'name': 'Sports & Outdoors', 'slug': 'sports-outdoors'},
        {'name': 'Home & Garden', 'slug': 'home-garden'},
        {'name': 'Toys & Games', 'slug': 'toys-games'},
        {'name': 'Mobile Phones', 'slug': 'mobile-phones'},
        {'name': 'Laptops & Computers', 'slug': 'laptops-computers'},
        {'name': 'Appliances', 'slug': 'appliances'},
        {'name': 'Other', 'slug': 'other'},
    ]
    
    created_count = 0
    for cat_data in categories:
        category, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults={'name': cat_data['name']}
        )
        if created:
            created_count += 1
            print(f"[OK] Created category: {category.name}")
        else:
            print(f"[SKIP] Category already exists: {category.name}")
    
    print(f"\n[OK] Created {created_count} new categories")
    print(f"[INFO] Total categories: {Category.objects.count()}")

if __name__ == '__main__':
    create_default_categories()

