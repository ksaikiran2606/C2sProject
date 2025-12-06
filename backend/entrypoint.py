#!/usr/bin/env python3
"""
Simple Python entrypoint for Railway deployment
This ensures the server starts even if there are minor issues
"""
import os
import sys
import subprocess

# Python unbuffered mode is already set via PYTHONUNBUFFERED=1 in Dockerfile
# Just ensure we flush all output

def main():
    try:
        # Immediate output to confirm script is running
        print("=" * 50, flush=True)
        print("ENTRYPOINT SCRIPT STARTING", flush=True)
        print("=" * 50, flush=True)
        print(f"Python: {sys.executable}", flush=True)
        print(f"Working directory: {os.getcwd()}", flush=True)
        
        # Get port from environment
        port = os.getenv('PORT', '8000')
        
        print("=" * 50, flush=True)
        print("Starting Django Application", flush=True)
        print("=" * 50, flush=True)
        print(f"PORT: {port}", flush=True)
        print(f"SECRET_KEY: {'SET' if os.getenv('SECRET_KEY') else 'NOT SET (using fallback)'}", flush=True)
        print(f"DATABASE_URL: {'SET' if os.getenv('DATABASE_URL') else 'NOT SET'}", flush=True)
        # Check Railway PostgreSQL variables
        if os.getenv('PGHOST'):
            print(f"Railway PostgreSQL: HOST={os.getenv('PGHOST')}, DB={os.getenv('PGDATABASE', 'N/A')}", flush=True)
        print("=" * 50, flush=True)
        print("", flush=True)
    
        # Try to run migrations (don't fail if it doesn't work)
        print("Running migrations...", flush=True)
        try:
            result = subprocess.run(
                [sys.executable, 'manage.py', 'migrate', '--noinput'],
                capture_output=True,
                text=True,
                timeout=60
            )
            if result.returncode == 0:
                print("Migrations completed successfully", flush=True)
            else:
                print(f"Migrations failed (exit code: {result.returncode})", flush=True)
                print("Continuing anyway - health endpoint doesn't require database", flush=True)
                if result.stderr:
                    print(f"Error output: {result.stderr[:500]}", flush=True)
        except Exception as e:
            print(f"Migrations error: {e}", flush=True)
            print("Continuing anyway...", flush=True)
        
        print("", flush=True)
        print("=" * 50, flush=True)
        print("Starting Gunicorn server...", flush=True)
        print("=" * 50, flush=True)
        print(f"Binding to: 0.0.0.0:{port}", flush=True)
        print("", flush=True)
        
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
    except Exception as e:
        print(f"FATAL ERROR in entrypoint: {e}", flush=True, file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()

