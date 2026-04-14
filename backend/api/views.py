from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from drf_spectacular.utils import extend_schema

from .serializers import RegisterSerializer, UserSerializer
from .models import User

# Create your views here.
@extend_schema(
    summary="User register",
    description="Accept login and password -> creates new user.",
    responses={201: RegisterSerializer},
    tags=['Auth']
)
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    @extend_schema(
        summary="User login",
        description="Accept login and password -> give JWT token.",
        tags=['Auth']
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(username=request.data["username"])
            response.data['user'] = UserSerializer(user).data
            response.data['token'] = response.data.pop('access')
            if 'refresh' in response.data: del response.data['refresh']
        return response