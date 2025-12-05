"""
Simple health check endpoint that doesn't require database
"""
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

@csrf_exempt
@require_http_methods(["GET", "HEAD"])
def health_check(request):
    """Simple health check that returns 200 OK - no database required"""
    return JsonResponse({"status": "ok", "service": "marketplace-api"})

