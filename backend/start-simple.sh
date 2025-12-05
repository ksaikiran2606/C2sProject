#!/bin/bash
# Simple startup script that just starts gunicorn
# Use this if start.sh has issues

PORT=${PORT:-8000}
echo "Starting Gunicorn on port $PORT"
exec gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 marketplace.wsgi:application

