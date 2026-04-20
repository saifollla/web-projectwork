import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  password = '';
  dobDay = '';
  dobMonth = '';
  dobYear = '';
  gender = '';

  days = Array.from({length: 31}, (_, i) => i + 1);
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  years = Array.from({length: 100}, (_, i) => new Date().getFullYear() - i);

  constructor(private router: Router, private authService: AuthService) {}

  onRegister() {
    const userData = {
    username: this.firstName.toLowerCase(), 
    password: this.password,
    first_name: this.firstName,
    last_name: this.lastName,
  
  };
    
    this.authService.register(userData).subscribe({
    next: (response) => {
      alert(`Lovely! ${this.firstName}, account is created. Now log in.`);
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Registration failed:', err);
      alert('Error: Registration failed. Please try again.');
    }
  });
}}