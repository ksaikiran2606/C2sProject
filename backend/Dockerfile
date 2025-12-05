FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

# Make start script executable
RUN chmod +x start.sh || true
RUN chmod +x start-simple.sh || true

EXPOSE 8000

# Use start.sh script which handles migrations and server startup properly
CMD ["./start.sh"]


