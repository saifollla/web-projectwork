import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
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

  constructor(private router: Router) {}

  login() {
    if (this.username && this.password){
      localStorage.setItem('access_token', 'fake-jwt-token-12345');
      this.router.navigate(['/chats']);
    }
    else {
      alert('Введите логин и пароль!');
    }
  }

  /*
  login() {
  this.authService.login(this.username, this.password).subscribe(response => {
    localStorage.setItem('access_token', response.token); 
    this.router.navigate(['/chats']);
  });
}
  */
}