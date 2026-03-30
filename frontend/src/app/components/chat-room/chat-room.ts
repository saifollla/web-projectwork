import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Message, User } from '../../models';
import { ChatService } from '../../services/chat';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './chat-room.html',
  styleUrl: './chat-room.css'
})
export class ChatRoom implements OnInit {
  chatId: string | null = '';
  newMessage = ''; 
  messages: Message[] = [];
  
  

  constructor(private route: ActivatedRoute, private chatService: ChatService) {
  }

  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('id');
    this.chatService.getMessages(this.chatId!).subscribe(data => {
    this.messages = data;
  });
  }

  send() {
    if (this.newMessage.trim()) {
    const msg: Message = {
      id: Date.now(),
      chat: Number(this.chatId),
      text: this.newMessage,
      sender: { id: 0, username: 'me' }, 
      created_at: new Date().toISOString()
    };
    this.messages.push(msg);
    this.newMessage = '';
  }}

  deleteMsg(id: number) {
    this.messages = this.messages.filter(m => m.id !== id);
  }
}