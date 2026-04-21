import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat'; 
import { Chat } from '../../models'; 
import { ToastrService } from 'ngx-toastr'; 

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
  allUsers: any[]=[];
  foundUsers: any[] = [];
  currentFilter: 'all' | 'unread' | 'favorites' = 'all';    
  filteredChats: Chat[] = [];
  isSearchActive: boolean = false;
  toastr = inject(ToastrService);

  chatService = inject(ChatService);
  router = inject(Router);
  ngModelSearch: string = '';
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.allChats = [
    {
      id: 1, name: 'Kanye', unread_count: 1, isFavorite: false,
      created_at: ''
    },
    {
      id: 2, name: 'Zarina', unread_count: 0, isFavorite: true,
      created_at: ''
    }
  ];
  this.applyFilters();

  // 2. Имитируем список ВСЕХ пользователей из базы
  this.allUsers = [
    { id: 1, username: 'Kanye' },
    { id: 2, username: 'Zarina' },
    { id: 3, username: 'Ilyas' }, // Новое имя!
    { id: 4, username: 'Aizere' }, // Новое имя!
    { id: 5, username: 'Admin' }
  ];
    this.chatService.getChats().subscribe(data => {
      this.allChats = data.map(c => ({
        ...c,
        unread_count: Math.floor(Math.random() * 5), //
      }));
      this.applyFilters();
      this.cdr.detectChanges();
    });
    this.chatService.getAllUsers().subscribe(users => {
      this.allUsers = users;
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
      const searchStr = this.ngModelSearch.toLowerCase();

      temp = temp.filter(c => c.name.toLowerCase().includes(this.ngModelSearch.toLowerCase()));
      
      const existingNames = this.allChats.map(c => c.name.toLowerCase());
      this.foundUsers = this.allUsers.filter(u => 
        u.username.toLowerCase().includes(this.ngModelSearch.toLowerCase()) &&
        !existingNames.includes(u.username.toLowerCase())
      );
    } else {
      this.isSearchActive = false;
      this.foundUsers = [];
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
    if (chat.isFavorite) {
      this.toastr.success(`Chat "${chat.name}" added to favorites!`);
    } else {
      this.toastr.info(`Chat "${chat.name}" removed from favorites.`);
    }
    //this.chatService.toggleFavorite(chat.id).subscribe();
  }
  startNewChat(userId: number) {
    this.chatService.createChat(userId).subscribe({
      next: (newChat) => {
        this.toastr.success('New chat created! ✨');
        this.allChats.push(newChat); 
        this.ngModelSearch = ''; 
        this.applyFilters();
        this.router.navigate(['/chats', newChat.id]); 
      },
      error: () => this.toastr.error('Could not start chat T-T')
    });
  }
}

