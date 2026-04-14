import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login'; 
import { ChatList } from './components/chat-list/chat-list'; 
import { ChatRoom } from './components/chat-room/chat-room';
import { authGuard } from './auth.guard';
import { RegisterComponent } from './components/register/register';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'chats', component: ChatList , canActivate: [authGuard],
    children: [ 
      {path: ':id', component: ChatRoom}]
    
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent }
];
