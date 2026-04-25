import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Chat, Message, User } from '../models'; 

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getMe(): Observable<User> {
    
    return this.http.get<User>(`${this.apiUrl}/users/me/`).pipe(
      tap(response => console.log('Chats loaded:', response))
    );
  }

  getChats(): Observable<Chat[]> {
    
    return this.http.get<Chat[]>(`${this.apiUrl}/chats/`).pipe(
      tap(response => console.log('Chats loaded:', response))
    );
  }

  getMessages(chatId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/chats/${chatId}/messages/`).pipe(
      tap(response => console.log('Chats loaded:', response))
    );
  }

  sendMessage(chatId: string, text: string): Observable<Message> {

    return this.http.post<Message>(
      `${this.apiUrl}/chats/${chatId}/messages/`, 
      { text }, 
    );
  }

  getAllUsers(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/users/`);
}

createChat(userId: number): Observable<Chat> {
  return this.http.post<Chat>(`${this.apiUrl}/chats/`, { user_id: userId });
}
markAsRead(chatId: number) {
  return this.http.post(`${this.apiUrl}/chats/${chatId}/read/`, {});
}

deleteMessage(messageId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/messages/${messageId}/`);
}

updateMessage(messageId: number, newText: string): Observable<Message> {
  return this.http.patch<Message>(
    `${this.apiUrl}/messages/${messageId}/`, 
    { text: newText }  );
}
}
