from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_health_check(request):
    return JsonResponse({'status': 'ok', 'message': 'API is running'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/health/', api_health_check, name='health_check'),
]