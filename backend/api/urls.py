from django.urls import path
from .views import login_view, logout_view, ChatList, MessageList, MessageDetail, register_view

urlpatterns = [
    path('api/auth/login/', login_view, name='login'),
    path('api/auth/logout/', logout_view, name='logout'),

    path('api/chats/', ChatList.as_view(), name='chat-list'),
    path('api/auth/register/', register_view, name='register'),
    
    path('api/chats/<int:chat_id>/messages/', MessageList.as_view(), name='message-list'),
    path('api/messages/<int:pk>/', MessageDetail.as_view(), name='message-detail'),
]