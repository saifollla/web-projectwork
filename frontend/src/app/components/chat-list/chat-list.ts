import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat'; 
import { Chat } from '../../models'; 

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.css'
})
export class ChatList implements OnInit {
  chats: Chat[] = []; 

  chatService = inject(ChatService);
  router = inject(Router);

  ngOnInit() {
    this.chatService.getChats().subscribe(data => {
      this.chats = data;
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}