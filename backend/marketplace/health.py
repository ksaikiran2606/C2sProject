"""
Simple health check endpoint that doesn't require database
"""
from django.http import JsonResponse

def health_check(request):
    """Simple health check that returns 200 OK"""
    return JsonResponse({"status": "ok", "service": "marketplace-api"})

