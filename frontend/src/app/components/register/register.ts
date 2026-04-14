import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private router: Router) {}

  onRegister() {
    const fullName = `${this.firstName} ${this.lastName}`;
    const birthDate = `${this.dobDay} ${this.dobMonth} ${this.dobYear}`;
    
    console.log('Registration Data:', {
      name: fullName,
      password: this.password,
      dob: birthDate,
      gender: this.gender
    });

    alert(`lovely! ${this.firstName}, is created. Now log in.`);
    this.router.navigate(['/login']);
  }
}