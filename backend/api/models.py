from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    gender = models.CharField(max_length=1, null=True, blank=True)
    favorite_chats = models.ManyToManyField('Chat', blank=True, related_name='favorited_by')

    def __str__(self):
        return self.username

class Chat(models.Model):
    name = models.CharField(max_length=255)
    participants = models.ManyToManyField(User, related_name='chats')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

#кастомная модель. менеджер сообщений поняли да
class MessageManager(models.Manager):
    def for_chat(self, chat_id):
        return self.filter(chat_id=chat_id).select_related('sender')

    def unread_for_user(self, user):
        return self.filter(read_statuses__user=user, read_statuses__is_read=False)
    

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    objects = MessageManager()

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender.username}: {self.text[:20]}"

class MessageReadStatus(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='read_statuses')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)

    class Meta:
        unique_together = ('message', 'user')

