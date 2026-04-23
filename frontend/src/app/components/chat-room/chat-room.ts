import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Message, User } from '../../models';
import { ChatService } from '../../services/chat';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './chat-room.html',
  styleUrl: './chat-room.css',
  host: {
    'class': 'app-chat-room',
  }
})
export class ChatRoom implements OnInit {
  chatId: string | null = '';
  newMessage = ''; 
  messages: Message[] = [];
  
  currentUserId: number | null = null;
  editingMessageId: number | null = null; 
  editBuffer: string = ''; 

  private cdr = inject(ChangeDetectorRef);
  

  constructor(private route: ActivatedRoute, private chatService: ChatService) {
  }

  ngOnInit() {

    this.chatService.getMe().subscribe(data => {
      this.currentUserId = data.id;
      this.cdr.detectChanges();
    })

    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id');
      if (this.chatId) {
    this.chatService.getMessages(this.chatId!).subscribe(data => {
      this.messages = data;
      console.log(data);
      this.cdr.detectChanges();
    });
    this.chatService.markAsRead(Number(this.chatId)).subscribe(() => {
        console.log('read');
        this.cdr.detectChanges();
      });
    }
      
  });
  }

  send() {
    if (this.newMessage.trim()) {

    this.chatService.sendMessage(this.chatId!, this.newMessage.trim()).subscribe({
      next: (savedMessage) => {
        this.messages.push(savedMessage);
        
        this.newMessage = '';

        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Error while sending message!');
      }
    });
  }}



deleteMsg(messageId: number) {
  if (confirm('delete?')) {
    this.chatService.deleteMessage(messageId).subscribe({
      next: () => {
        this.messages = this.messages.filter(m => m.id !== messageId);
        this.cdr.detectChanges(); 
      },
      error: () => alert('Error while deleting message!')
    });
  }
}
deleteSelectedMessage() {
    if (this.selectedMessageId) {
      this.deleteMsg(this.selectedMessageId); // Просто вызываем общий метод
    }
  }

startEdit(msg: any) {
  this.editingMessageId = msg.id;
  this.editBuffer = msg.text;   
}
startEditFromTop() {
  if (this.selectedMessageId) {
    const msg = this.messages.find(m => m.id === this.selectedMessageId);
    if (msg) {
      this.startEdit(msg);
      this.selectedMessageId = null; 
    }
  }
}
saveEdit(messageId: number) {
  if (!this.editBuffer.trim()) return;

  this.chatService.updateMessage(messageId, this.editBuffer).subscribe({
    next: (updatedMsg) => {
      const msgIndex = this.messages.findIndex(m => m.id === messageId);
      if (msgIndex !== -1) {
        this.messages[msgIndex].text = updatedMsg.text;
      }
      this.cancelEdit(); 
      this.cdr.detectChanges();
    }
  });
}
cancelEdit() {
  this.editingMessageId = null;  
  this.editBuffer = '';
}

  selectedMessageId: number | null = null;
  toggleSelectMessage(msg: Message, event: Event) {
  event.stopPropagation(); 

  if (msg.sender.id !== this.currentUserId) return;

  if (this.selectedMessageId === msg.id) {
    this.selectedMessageId = null;
  } else {
    this.selectedMessageId = msg.id;
    this.cancelEdit(); 
  }
}

@HostListener('document:click', ['$event'])
deselectOnOutsideClick(event: Event) {
  this.selectedMessageId = null;
}


}