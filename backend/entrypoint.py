#!/usr/bin/env python3
"""
Simple Python entrypoint for Railway deployment
This ensures the server starts even if there are minor issues
"""
import os
import sys
import subprocess

def main():
    # Get port from environment
    port = os.getenv('PORT', '8000')
    
    print("=" * 50)
    print("Starting Django Application")
    print("=" * 50)
    print(f"PORT: {port}")
    print(f"SECRET_KEY: {'SET' if os.getenv('SECRET_KEY') else 'NOT SET (using fallback)'}")
    print(f"DATABASE_URL: {'SET' if os.getenv('DATABASE_URL') else 'NOT SET'}")
    print("=" * 50)
    print()
    
    # Try to run migrations (don't fail if it doesn't work)
    print("Running migrations...")
    try:
        result = subprocess.run(
            [sys.executable, 'manage.py', 'migrate', '--noinput'],
            capture_output=True,
            text=True,
            timeout=60
        )
        if result.returncode == 0:
            print("Migrations completed successfully")
        else:
            print(f"Migrations failed (exit code: {result.returncode})")
            print("Continuing anyway - health endpoint doesn't require database")
            if result.stderr:
                print("Error output:", result.stderr[:500])
    except Exception as e:
        print(f"Migrations error: {e}")
        print("Continuing anyway...")
    
    print()
    print("=" * 50)
    print("Starting Gunicorn server...")
    print("=" * 50)
    print(f"Binding to: 0.0.0.0:{port}")
    print()
    
    # Start gunicorn
    # Use exec to replace this process
    os.execvp('gunicorn', [
        'gunicorn',
        '--bind', f'0.0.0.0:{port}',
        '--workers', '2',
        '--timeout', '120',
        '--access-logfile', '-',
        '--error-logfile', '-',
        '--log-level', 'info',
        'marketplace.wsgi:application'
    ])

if __name__ == '__main__':
    main()

