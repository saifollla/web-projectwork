import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    if (this.username && this.password){
      this.authService.login({ username: this.username, password: this.password }).subscribe({
        next: (response) => {
          this.router.navigate(['/chats']);
        },
        error: (err) => {
          console.error('Ошибка входа:', err);
          alert('Ошибка: ' + (err.error?.detail || 'Неверный логин или пароль'));
        }
      });
    }
    else {
      alert('Введите логин и пароль!');
    }
  }

}