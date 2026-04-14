from rest_framework import serializers
from .models import User, Chat, Message, ChatMember

class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar_url', 'is_online']

    def get_avatar_url(self, obj):
        return "localhost/storage/img.jpg"

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
class LastMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    text = serializers.CharField(source='content')

    class Meta:
        model = Message
        # фронт разберись
        fields = ['sender_name', 'text', 'created_at']

class ChatListSerializer(serializers.ModelSerializer):
    chat_id = serializers.IntegerField(source='id')
    title = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ['chat_id', 'type', 'title', 'last_message', 'unread_count']

    def get_title(self, obj):
        if obj.type == 'direct':
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                other_member = obj.members.exclude(user=request.user).select_related('user').first()
                if other_member:
                    return other_member.user.username
            return "Unknown User"
        return obj.title

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-created_at').first()
        if last_msg:
            return LastMessageSerializer(last_msg).data
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0

class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    text = serializers.CharField(source='content')

    class Meta:
        model = Message
        fields = ['id', 'sender_id', 'text', 'type', 'is_read', 'created_at', 'reply_to']