import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';

  login() {
    console.log('Пытаемся войти с:', this.username, this.password);
    alert('Кнопка нажата! Данные в консоли.');
  }
}