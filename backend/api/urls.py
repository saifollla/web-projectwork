from django.urls import path
from .views import login_view, logout_view, ChatList, MessageList, MessageDetail, mark_messages_as_read, register_view, get_me, user_list_view
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


urlpatterns = [
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/register/', register_view, name='register'),

    path('users/me/', get_me, name='get-me'),
    path('users/', user_list_view, name='user-list'),

    path('chats/', ChatList.as_view(), name='chat-list'),
    path('chats/<int:chat_id>/messages/', MessageList.as_view(), name='message-list'),
    path('messages/<int:pk>/', MessageDetail.as_view(), name='message-detail'),

    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('chats/<int:chat_id>/read/', mark_messages_as_read),
]
