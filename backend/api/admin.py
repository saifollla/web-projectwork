from django.contrib import admin
from .models import User, Chat, ChatMember, Message

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'is_online')

@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'type', 'created_at')

@admin.register(ChatMember)
class ChatMemberAdmin(admin.ModelAdmin):
    list_display = ('chat', 'user', 'is_admin')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'chat', 'created_at')
    readonly_fields = ('created_at',)