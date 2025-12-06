#!/bin/bash
# Don't exit on error - we want server to start even if migrations fail
set +e

echo "=========================================="
echo "Starting Django Application"
echo "=========================================="
echo "PORT: ${PORT:-8000}"

# Check for SECRET_KEY (critical)
if [ -z "$SECRET_KEY" ]; then
    echo ""
    echo "=========================================="
    echo "ERROR: SECRET_KEY is not set!"
    echo "=========================================="
    echo ""
    echo "SECRET_KEY is required for Django to start."
    echo "Please set it in Railway Variables tab:"
    echo ""
    echo "1. Go to Railway → Your Service → Variables"
    echo "2. Click '+ New Variable'"
    echo "3. Name: SECRET_KEY"
    echo "4. Value: Generate with PowerShell:"
    echo "   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})"
    echo ""
    echo "The server cannot start without SECRET_KEY."
    exit 1
else
    echo "SECRET_KEY: ${SECRET_KEY:0:10}... (set)"
fi

if [ -n "$DATABASE_URL" ]; then
    echo "DATABASE_URL: ${DATABASE_URL:0:50}..."
else
    echo "WARNING: DATABASE_URL not set!"
    echo "Make sure PostgreSQL is added to Railway project"
    echo "Server will use SQLite fallback if configured"
fi
echo ""

# Test Django setup
echo "Testing Django setup..."
python -c "import django; django.setup(); print('Django setup OK')" || echo "Django setup check failed, continuing..."

# Run migrations (with retry and error handling)
echo "Running database migrations..."
python manage.py migrate --noinput 2>&1
MIGRATION_EXIT_CODE=$?
if [ $MIGRATION_EXIT_CODE -ne 0 ]; then
    echo "WARNING: Migration failed (exit code: $MIGRATION_EXIT_CODE), but continuing..."
    echo "You may need to run migrations manually"
    echo "Server will start anyway - health endpoint doesn't require database"
else
    echo "Migrations completed successfully"
fi

# Check if we can import the WSGI application
echo "Checking WSGI application..."
WSGI_CHECK_OUTPUT=$(python -c "
import os
import sys
import traceback
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'marketplace.settings')
try:
    # Try to import Django first
    import django
    django.setup()
    print('Django setup OK')
    
    # Now try to import WSGI
    from marketplace.wsgi import application
    print('WSGI import OK')
    sys.exit(0)
except Exception as e:
    print(f'ERROR: Cannot import WSGI application')
    print(f'Error type: {type(e).__name__}')
    print(f'Error message: {str(e)}')
    print('\\nFull traceback:')
    traceback.print_exc()
    sys.exit(1)
" 2>&1)

WSGI_CHECK_EXIT=$?
echo "$WSGI_CHECK_OUTPUT"

if [ $WSGI_CHECK_EXIT -ne 0 ]; then
    echo ""
    echo "=========================================="
    echo "ERROR: Cannot import WSGI application!"
    echo "=========================================="
    echo ""
    echo "Common causes:"
    echo "1. Missing SECRET_KEY environment variable"
    echo "2. Database connection issues"
    echo "3. Missing Python dependencies"
    echo "4. Django settings error"
    echo ""
    echo "Check Railway Variables tab and ensure:"
    echo "- SECRET_KEY is set"
    echo "- DATABASE_URL is set (if using PostgreSQL)"
    echo "- All required environment variables are configured"
    echo ""
    echo "The server cannot start without fixing this error."
    exit 1
fi

# Start gunicorn
echo ""
echo "Starting Gunicorn server..."
echo "Binding to: 0.0.0.0:${PORT:-8000}"
echo "Workers: 2"
echo "Timeout: 120"
echo ""

# Ensure PORT is set
if [ -z "$PORT" ]; then
    echo "WARNING: PORT not set, using default 8000"
    export PORT=8000
fi

# Use exec to replace shell process
# Remove --preload flag as it can cause issues with Django initialization
exec gunicorn \
    --bind 0.0.0.0:${PORT} \
    --workers 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    --capture-output \
    marketplace.wsgi:application

