import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  
  messages = [
    { id: 1, text: 'hello', sender: 'other', time: '12:00' },
    { id: 2, text: 'byebye', sender: 'me', time: '12:05' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('id');
  }

  send() {
    if (this.newMessage.trim()) {
      this.messages.push({
        id: Date.now(),
        text: this.newMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.newMessage = ''; 
    }
  }

  deleteMsg(id: number) {
    this.messages = this.messages.filter(m => m.id !== id);
  }
}