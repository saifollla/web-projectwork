from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Message, Chat
from .serializers import MessageModelSerializer


#CBV для сообщений. 
class MessageList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, chat_id):
        # Используем наш Custom Manager!
        messages = Message.objects.for_chat(chat_id)
        serializer = MessageModelSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, chat_id):
        serializer = MessageModelSerializer(data=request.data)
        if serializer.is_valid():
            # ВАЖНОЕ ТРЕБОВАНИЕ ТЗ: Привязываем к authenticated user
            serializer.save(sender=request.user, chat_id=chat_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)