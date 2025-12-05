#!/bin/bash
set -e

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
python manage.py migrate --noinput 2>&1 || {
    echo "Migration failed, but continuing..."
    echo "You may need to run migrations manually"
}

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

