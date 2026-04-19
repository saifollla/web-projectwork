from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import Message, Chat
from .serializers import MessageModelSerializer, LoginSerializer, ChatListSerializer

class ChatList(APIView):
    def get(self, request):
        chats = Chat.objects.filter(participants=request.user)
        serializer = ChatListSerializer(chats, many=True)
        return Response(serializer.data)

class MessageList(APIView):    
    def get(self, request, chat_id):
        messages = Message.objects.for_chat(chat_id)
        serializer = MessageModelSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, chat_id):
        serializer = MessageModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(sender=request.user, chat_id=chat_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MessageDetail(APIView):
    def delete(self, request, pk):
        try:
            message = Message.objects.get(pk=pk, sender=request.user)
            message.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    #если надо
    # def delete(self, request, pk):
    #     try:
    #         message = Message.objects.get(pk=pk, sender=request.user)
    #         message.delete()
    #         return Response(status=status.HTTP_204_NO_CONTENT)
    #     except Message.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)

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