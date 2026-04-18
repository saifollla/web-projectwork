from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Chat, Message, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class MessageModelSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'text', 'created_at']


class ChatListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    last_message_text = serializers.CharField(source='messages.last.text', read_only=True)
    unread_count = serializers.IntegerField(default=0)

#Вот этот сериалайзер от балды добавил. Нужно нормальный написать.
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)