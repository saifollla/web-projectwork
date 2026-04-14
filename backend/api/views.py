from django.db.models import Q
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from drf_spectacular.utils import extend_schema

from .models import User, Chat, Message, ChatMember
from .serializers import (
    RegisterSerializer, UserSerializer, 
    ChatListSerializer, MessageSerializer
)

# --- AUTH VIEWS ---

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class MyTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(username=request.data["username"])
            response.data['user'] = UserSerializer(user).data
            response.data['token'] = response.data.pop('access')
            if 'refresh' in response.data: 
                del response.data['refresh']
        return response

# --- CHATS VIEWS ---

class ChatListView(generics.ListCreateAPIView):
    #GET Список чатов текущего юзера + поиск.
    #POST Создание чата 
    permission_classes = [IsAuthenticated]
    serializer_class = ChatListSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Chat.objects.filter(members__user=user).distinct()
        
        search_query = self.request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | 
                Q(members__user__username__icontains=search_query)
            ).distinct()
        
        return queryset

    def create(self, request, *args, **kwargs):
        chat_type = request.data.get('type')
        
        if chat_type == 'direct':
            recipient_id = request.data.get('recipient_id')
            existing_chat = Chat.objects.filter(
                type='direct', 
                members__user=request.user
            ).filter(members__user_id=recipient_id).first()
            
            if existing_chat:
                return Response(ChatListSerializer(existing_chat, context={'request': request}).data)
            
            chat = Chat.objects.create(type='direct')
            ChatMember.objects.create(chat=chat, user=request.user)
            ChatMember.objects.create(chat=chat, user_id=recipient_id)
            
        elif chat_type == 'group':
            title = request.data.get('title', 'New Group')
            participants = request.data.get('participants', [])
            chat = Chat.objects.create(type='group', title=title)
            ChatMember.objects.create(chat=chat, user=request.user, is_admin=True)
            for p_id in participants:
                ChatMember.objects.create(chat=chat, user_id=p_id)
        
        return Response(ChatListSerializer(chat, context={'request': request}).data, status=status.HTTP_201_CREATED)

# --- MESSAGES VIEWS ---

class MessageListView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        chat_id = self.kwargs['chat_id']
        before_id = self.request.query_params.get('before_id')
        limit = int(self.request.query_params.get('limit', 20))

        queryset = Message.objects.filter(chat_id=chat_id).order_by('-created_at')

        if before_id:
            queryset = queryset.filter(id__lt=before_id)
        
        return queryset[:limit]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        messages = serializer.data
        
        next_cursor = messages[-1]['id'] if messages else None
        
        return Response({
            "chat_id": int(self.kwargs['chat_id']),
            "messages": messages,
            "has_more": len(messages) >= int(request.query_params.get('limit', 20)),
            "next_cursor": next_cursor
        })

    def perform_create(self, serializer):
        chat = Chat.objects.get(id=self.kwargs['chat_id'])
        serializer.save(
            sender=self.request.user, 
            chat=chat,
            content=self.request.data.get('content') 
        )

# --- USERS VIEWS ---

class UserSearchView(generics.ListAPIView):
    """Поиск пользователей по нику"""
    serializer_class = UserSerializer
    
    def get_queryset(self):
        query = self.request.query_params.get('search', '')
        return User.objects.filter(username__icontains=query).exclude(id=self.request.user.id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"users": serializer.data})

class UserMeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user