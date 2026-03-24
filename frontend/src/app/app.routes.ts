import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login'; 
import { ChatList } from './components/chat-list/chat-list'; 
import { ChatRoom } from './components/chat-room/chat-room';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'chats', component: ChatList },
  { path: 'chat/:id', component: ChatRoom },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
