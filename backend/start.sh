#!/bin/bash
# Don't exit on error - we want server to start even if migrations fail
set +e

echo "=========================================="
echo "Starting Django Application"
echo "=========================================="
echo "PORT: ${PORT:-8000}"
if [ -n "$DATABASE_URL" ]; then
    echo "DATABASE_URL: ${DATABASE_URL:0:50}..."
else
    echo "WARNING: DATABASE_URL not set!"
    echo "Make sure PostgreSQL is added to Railway project"
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
python -c "from marketplace.wsgi import application; print('WSGI import OK')" || {
    echo "ERROR: Cannot import WSGI application!"
    exit 1
}

# Start gunicorn
echo ""
echo "Starting Gunicorn server..."
echo "Binding to: 0.0.0.0:${PORT:-8000}"
echo "Workers: 2"
echo "Timeout: 120"
echo ""

# Use exec to replace shell process
exec gunicorn \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    --preload \
    marketplace.wsgi:application

