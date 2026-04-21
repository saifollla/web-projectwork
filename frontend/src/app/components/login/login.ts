import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService) {}

  login() {
    if (this.username && this.password){
      this.authService.login({ username: this.username, password: this.password }).subscribe({
        next: (response) => {
          this.toastr.success('Welcome back, ' + this.username + ':3');
          localStorage.setItem('access_token', response.access_token);
          this.router.navigate(['/chats']);
        },
        error: (err) => {
          console.error('Error:', err);
          this.toastr.error('Error: ' + (err.error?.detail || 'Login failed. Please try again T-T'));
        }
      });
    }
    else {
      this.toastr.error('Please enter both username and password ;(');
    }
  }

}