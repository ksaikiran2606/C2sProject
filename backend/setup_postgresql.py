#!/usr/bin/env python
"""
Script to help set up PostgreSQL database
Run this after creating the database in PostgreSQL
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'marketplace.settings')
django.setup()

from django.db import connection
from django.core.management import execute_from_command_line

def check_postgresql_connection():
    """Check if PostgreSQL connection works"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()[0]
            print(f"[OK] Connected to PostgreSQL!")
            print(f"     Version: {version.split(',')[0]}")
            return True
    except Exception as e:
        print(f"[ERROR] Failed to connect to PostgreSQL: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure PostgreSQL is installed and running")
        print("2. Check your .env file has correct credentials")
        print("3. Make sure database 'marketplace_db' exists")
        print("4. Verify USE_POSTGRES=True in .env")
        return False

def check_database_exists():
    """Check if marketplace_db exists"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT current_database();")
            db_name = cursor.fetchone()[0]
            print(f"[OK] Using database: {db_name}")
            return True
    except Exception as e:
        print(f"[ERROR] Database issue: {e}")
        return False

def main():
    print("=" * 50)
    print("PostgreSQL Setup Check")
    print("=" * 50)
    print()
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("[WARNING] .env file not found!")
        print("          Create .env file from .env.example")
        print("          Then set USE_POSTGRES=True and database credentials")
        return
    
    # Check connection
    if not check_postgresql_connection():
        return
    
    if not check_database_exists():
        return
    
    print()
    print("[OK] PostgreSQL is configured correctly!")
    print()
    print("Next steps:")
    print("1. Run migrations: python manage.py migrate")
    print("2. Create superuser: python manage.py createsuperuser")
    print("3. Load categories: python create_categories.py")
    print()

if __name__ == '__main__':
    main()


