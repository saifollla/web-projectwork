from django.urls import path
from .views import RegisterView, MyTokenObtainPairView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # AUTH
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', MyTokenObtainPairView.as_view(), name='login'),

    # DOCS
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]