#!/bin/bash
set -e

echo "=========================================="
echo "Starting Django Application"
echo "=========================================="
echo "PORT: ${PORT:-8000}"
echo "DATABASE_URL: ${DATABASE_URL:0:50}..." # Show first 50 chars
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "WARNING: DATABASE_URL not set!"
    echo "Make sure PostgreSQL is added to Railway project"
fi

# Run migrations (with retry)
echo "Running database migrations..."
for i in {1..3}; do
    if python manage.py migrate --noinput; then
        echo "Migrations completed successfully"
        break
    else
        echo "Migration attempt $i failed, retrying..."
        sleep 2
    fi
done

# Start gunicorn
echo ""
echo "Starting Gunicorn server..."
echo "Binding to: 0.0.0.0:${PORT:-8000}"
exec gunicorn --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 120 --access-logfile - --error-logfile - --log-level info marketplace.wsgi:application

