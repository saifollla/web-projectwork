import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat'; 
import { Chat } from '../../models'; 

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, RouterOutlet], 
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.css'
  
})
export class ChatList implements OnInit {
  chats: Chat[] = []; 
  allChats: Chat[] = [];  
  currentFilter: 'all' | 'unread' | 'favorites' = 'all';    
  filteredChats: Chat[] = [];
  isSearchActive: boolean = false;

  chatService = inject(ChatService);
  router = inject(Router);
  ngModelSearch: string = '';
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.chatService.getChats().subscribe(data => {
      this.allChats = data.map(c => ({
        ...c,
        unread_count: Math.floor(Math.random() * 5),
        isFavorite: Math.random() > 0.8,
      }));
      this.applyFilters();
      this.cdr.detectChanges();
      console.log('Чаты после фильтрации:', this.chats);
    });
  }

  setFilter(filter: 'all' | 'unread' | 'favorites') {
    this.currentFilter = filter;
    this.applyFilters();
  }
  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  onSearchClick() {
  this.applyFilters();
}

  applyFilters() {
    let temp = this.allChats;

    if (this.ngModelSearch) {
      this.isSearchActive = true; 
      temp = temp.filter(c => c.name.toLowerCase().includes(this.ngModelSearch.toLowerCase()));
    }
    else{
      this.isSearchActive = false; 
    }

    if (this.currentFilter === 'unread') {
      temp = temp.filter(c =>(c.unread_count || 0) > 0);
    }
    else if (this.currentFilter === 'favorites') {
      temp = temp.filter(c => c.isFavorite);
    }

    this.chats = temp;

  
  }
  toggleFavorite(chat: Chat) {
    chat.isFavorite = !chat.isFavorite;
    this.applyFilters();
    //this.chatService.toggleFavorite(chat.id).subscribe();
  }
}

