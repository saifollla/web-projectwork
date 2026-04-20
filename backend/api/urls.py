from django.urls import path
from .views import login_view, logout_view, ChatList, MessageList, MessageDetail, register_view
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


urlpatterns = [
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),

    path('chats/', ChatList.as_view(), name='chat-list'),
    path('auth/register/', register_view, name='register'),
    
    path('chats/<int:chat_id>/messages/', MessageList.as_view(), name='message-list'),
    path('messages/<int:pk>/', MessageDetail.as_view(), name='message-detail'),

    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]