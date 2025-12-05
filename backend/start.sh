#!/bin/bash
set -e

echo "=========================================="
echo "Starting Django Application"
echo "=========================================="

# Run migrations
echo "Running database migrations..."
python manage.py migrate --noinput || echo "Migration failed, continuing..."

# Start gunicorn
echo "Starting Gunicorn server..."
echo "Listening on port: ${PORT:-8000}"
exec gunicorn --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 120 --access-logfile - --error-logfile - marketplace.wsgi:application

