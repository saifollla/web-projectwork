import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat'; 
import { Chat } from '../../models'; 

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], 
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.css'
  
})
export class ChatList implements OnInit {
  chats: Chat[] = []; 
  allChats: Chat[] = [];      
  filteredChats: Chat[] = [];
  isSearchActive: boolean = false;

  chatService = inject(ChatService);
  router = inject(Router);
  ngModelSearch: string = '';

  ngOnInit() {
    this.chatService.getChats().subscribe(data => {
      this.chats = data;
      this.allChats = data;
      this.filteredChats = data;
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  onSearchClick() {
  const query = this.ngModelSearch.toLowerCase().trim();  
  if (!query) {
      this.chats = this.allChats; 
      this.isSearchActive = false;
      return;
    }
  this.isSearchActive = true; 
  this.chats = this.allChats.filter(chat => 
      chat.name.toLowerCase().includes(query)
    );
  if (this.filteredChats.length === 0) {
      console.log('No chats found matching:', query);
    }
}
}