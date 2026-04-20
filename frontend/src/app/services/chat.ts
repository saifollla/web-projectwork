import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Chat, Message } from '../models'; 

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getChats(): Observable<Chat[]> {
    const mockChats: Chat[] = [
  { 
    id: 1, 
    name: 'Kanye', 
    participants: [], 
    last_message: { id: 1, chat: 1, text: 'lalalala', sender: {id: 1, username: 'admin'}, created_at: '' } 
  },
  { 
    id: 2, 
    name: 'Aizere', 
    participants: [], 
    last_message: { id: 2, chat: 2, text: 'hey', sender: {id: 2, username: 'user'}, created_at: '' } 
  }
];
    return of(mockChats);
    // ilyas ya tebya zhdu
    // return this.http.get<Chat[]>(`${this.apiUrl}/chats/`);
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
