from django.urls import path
from .views import RegisterView, MyTokenObtainPairView

urlpatterns = [
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', MyTokenObtainPairView.as_view(), name='login'),
]