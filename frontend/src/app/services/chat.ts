import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Chat, Message, User } from '../models'; 
import { TestBed } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getMe(): Observable<User> {
    const headers = this.getHeaders();
    
    return this.http.get<User>(`${this.apiUrl}/users/me/`, { headers }).pipe(
      tap(response => console.log('Chats loaded:', response))
    );
  }

  getChats(): Observable<Chat[]> {
    const headers = this.getHeaders();
    
    return this.http.get<Chat[]>(`${this.apiUrl}/chats/`, { headers }).pipe(
      tap(response => console.log('Chats loaded:', response))
    );
  }

  getMessages(chatId: string): Observable<Message[]> {
    const headers = this.getHeaders();
    
    return this.http.get<Message[]>(`${this.apiUrl}/chats/${chatId}/messages/`, { headers }).pipe(
      tap(response => console.log('Chats loaded:', response))
    );
  }

  sendMessage(chatId: string, text: string): Observable<Message> {
    const headers = this.getHeaders();

    return this.http.post<Message>(
      `${this.apiUrl}/chats/${chatId}/messages/`, 
      { text },
      { headers: headers }, 
    );
  }

  getAllUsers(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/users/`);
}

createChat(userId: number): Observable<Chat> {
  return this.http.post<Chat>(`${this.apiUrl}/chats/`, { user_id: userId });
}
}
