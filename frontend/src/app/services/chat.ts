import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Chat, Message } from '../models'; 

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Token ${token}`
    });
  }

  getChats(): Observable<Chat[]> {
    const headers = this.getHeaders();
    
    return this.http.get<Chat[]>(`${this.apiUrl}/chats/`, { headers }).pipe(
      tap(response => console.log('Chats loaded:', response))
    );
  }

  getMessages(chatId: string): Observable<Message[]> {
    const mockMessages: Message[] = [
      { id: 1, chat: 1, text: 'Heyyyyy!', sender: {id: 1, username: 'user'}, created_at: '' }
    ];
    return of(mockMessages);
    //return this.http.get<Message[]>(`${this.apiUrl}/chats/${chatId}/messages/`);
  }

  sendMessage(chatId: string, text: string): Observable<Message> {
  return this.http.post<Message>(`${this.apiUrl}/chats/${chatId}/messages/`, { text });
}
}
