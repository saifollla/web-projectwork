import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  styleUrl: './chat-room.css',
  host: {
    'class': 'app-chat-room',
  }
})
export class ChatRoom implements OnInit {
  chatId: string | null = '';
  newMessage = ''; 
  messages: Message[] = [];
  
  currentUserId: number | null = null;
  private cdr = inject(ChangeDetectorRef);
  

  constructor(private route: ActivatedRoute, private chatService: ChatService) {
  }

  ngOnInit() {

    this.chatService.getMe().subscribe(data => {
      this.currentUserId = data.id;
      this.cdr.detectChanges();
    })

    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id');
      if (this.chatId) {
    this.chatService.getMessages(this.chatId!).subscribe(data => {
      this.messages = data;
      console.log(data);
      this.cdr.detectChanges();
    });
    this.chatService.markAsRead(Number(this.chatId)).subscribe(() => {
        console.log('read');
        this.cdr.detectChanges();
      });
    }
      
  });
  }

  send() {
    if (this.newMessage.trim()) {

    this.chatService.sendMessage(this.chatId!, this.newMessage.trim()).subscribe({
      next: (savedMessage) => {
        console.log(savedMessage);
        const msg: Message = {
          id: savedMessage.id,
          chat: savedMessage.chat,
          text: savedMessage.text,
          sender: savedMessage.sender,
          created_at: savedMessage.created_at
        };
        this.messages.push(msg);
        
        this.newMessage = '';

        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Error while sending message!');
      }
    });
  }}

  deleteMsg(id: number) {
    this.messages = this.messages.filter(m => m.id !== id);
  }
}