from django.contrib import admin
from .models import UserProfile, Chat, Message, MessageReadStatus

@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at') 
    search_fields = ('name',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'chat', 'text', 'created_at')
    list_filter = ('chat', 'sender') 
    search_fields = ('text',)

admin.site.register(UserProfile)
admin.site.register(MessageReadStatus)