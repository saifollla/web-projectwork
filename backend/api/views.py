from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema
# from django.contrib.auth.models import User
from .models import Message, Chat, User
from .serializers import MessageModelSerializer, LoginSerializer, ChatListSerializer, RegisterSerializer, UserSerializer



class ChatList(APIView):
    def get(self, request):
        chats = Chat.objects.filter(participants=request.user)
        serializer = ChatListSerializer(chats, many=True, context={'request': request})
        return Response(serializer.data)
    
    def post(self, request):
        target_user_id = request.data.get('user_id')
        if not target_user_id:
            return Response({"error": "user_id is required"}, status=400)
        try:
            target_user = User.objects.get(id=target_user_id)
            chat_name = f"Chat with {target_user.username}"
            new_chat = Chat.objects.create(name=chat_name)
            new_chat.participants.add(request.user, target_user)
            return Response({"id": new_chat.id, "name": new_chat.name}, status=201)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

class MessageList(APIView):    
    def get(self, request, chat_id):
        messages = Message.objects.for_chat(chat_id)
        serializer = MessageModelSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, chat_id):
        serializer = MessageModelSerializer(data=request.data)
        print(serializer.initial_data)
        if serializer.is_valid():
            message = serializer.save(sender=request.user, chat_id=chat_id)
            from .models import MessageReadStatus, Chat
            participants = message.chat.participants.all()
            for participant in participants:
                MessageReadStatus.objects.create(
                    message=message,
                    user=participant,
                    is_read=(participant == request.user)
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MessageDetail(APIView):
    def get(self, request, pk):
        try:
            message = Message.objects.get(pk=pk)
            serializer = MessageModelSerializer(message)
            return Response(serializer.data)
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    def patch(self, request, pk):
        try:
            message = Message.objects.get(pk=pk, sender=request.user)
            serializer = MessageModelSerializer(message, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Message.DoesNotExist:
            return Response({"error": "Message not found or not your"}, status=404)

    def delete(self, request, pk):
        try:
            message = Message.objects.get(pk=pk, sender=request.user)
            message.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
def user_list_view(request):
    users = User.objects.exclude(id=request.user.id)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@extend_schema(
    request=LoginSerializer,
    responses={200: {'type': 'object', 'properties': {'access_token': {'type': 'string'}}}},
    description="Авторизация пользователя и получение токена."
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny]) 
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'access_token': token.key}) 
        return Response({'error': 'Invalid Credentials'}, status=400)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({"message": "Successfully logged out"}, status=200)

@extend_schema(
    request=RegisterSerializer,
    responses={200: {'type': 'object', 'properties': {'access_token': {'type': 'string'}}}},
    description="Авторизация пользователя и получение токена."
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password'],
            gender=serializer.validated_data['gender'],
        )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'access_token': token.key}, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def mark_messages_as_read(request, chat_id):
    from .models import MessageReadStatus
    unread_statuses = MessageReadStatus.objects.filter(
        message__chat_id=chat_id,
        user=request.user,
        is_read=False
    )
    unread_statuses.update(is_read=True)
    
    return Response({"message": "Messages marked as read"}, status=200)