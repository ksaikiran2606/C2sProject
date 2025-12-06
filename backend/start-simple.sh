#!/bin/bash
# Simple startup script that just starts gunicorn
# Use this if start.sh has issues

PORT=${PORT:-8000}
echo "=========================================="
echo "Simple Startup - Starting Gunicorn"
echo "=========================================="
echo "PORT: $PORT"
echo ""

# Try to run migrations (but don't fail if it doesn't work)
echo "Attempting migrations..."
python manage.py migrate --noinput 2>&1 || echo "Migrations skipped or failed, continuing..."

echo "Starting Gunicorn server..."
exec gunicorn \
    --bind 0.0.0.0:$PORT \
    --workers 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    marketplace.wsgi:application

