from django.urls import path
from .views import (
    RegisterView, MyTokenObtainPairView, 
    ChatListView, MessageListView, 
    UserSearchView, UserMeView
)
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # AUTH
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', MyTokenObtainPairView.as_view(), name='login'),

    # CHATS & MESSAGES
    path('chats/', ChatListView.as_view(), name='chat-list'),
    path('chats/<int:chat_id>/messages/', MessageListView.as_view(), name='message-list'),

    # USERS
    path('users/', UserSearchView.as_view(), name='user-search'),
    path('users/me', UserMeView.as_view(), name='user-me'),

    # DOCS
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]