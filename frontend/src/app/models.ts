export interface User {
  id: number;
  username: string;
  email?: string;
}

export interface Message {
  id: number;
  chat: number;      
  sender: User;      
  text: string;
  created_at: string; 
}

export interface Chat {
  id: number;
  name: string;
  participants: User[]; 
  last_message?: Message; 
}