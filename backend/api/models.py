from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Chat(models.Model):
    name = models.CharField(max_length=255)
    participants = models.ManyToManyField(User, related_name='chats')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# 2. Модель Сообщения
class Message(self, models.Model):
    chat = models.ForeignKey(Chat, on_update=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at'] # Чтобы сообщения шли по порядку времени

    def __str__(self):
        return f'{self.sender.username}: {self.text[:20]}'