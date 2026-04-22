from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import Chat, Message, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class MessageModelSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'text', 'created_at']
        read_only_fields = ['chat']


# class ChatListSerializer(serializers.Serializer):
#     id = serializers.IntegerField()
#     name = serializers.CharField()
#     last_message_text = serializers.CharField(source='messages.last.text', read_only=True)
#     unread_count = serializers.IntegerField(default=0)
class LastMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'text', 'created_at']

class ChatListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField() # Переопределяем логику
    unread_count = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ['id', 'name', 'last_message', 'unread_count', 'is_favorite','created_at']

    def get_name(self, obj):
        request = self.context.get('request')

        if not request or not request.user:
            return obj.name

        other_participant = obj.participants.exclude(id=request.user.id).first()

        if other_participant:
            full_name = f"{other_participant.first_name} {other_participant.last_name}".strip()
            return full_name or other_participant.username

        return "Favorite"

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-created_at').first()
        if last_msg:
            return LastMessageSerializer(last_msg).data
        return None
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from .models import MessageReadStatus
            return MessageReadStatus.objects.filter(
                message__chat=obj,
                user=request.user,
                is_read=False
            ).count()
        return 0
    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.favorite_chats.filter(id=obj.id).exists()
        return False

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    gender = serializers.CharField()