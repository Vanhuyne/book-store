import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  formSubmitted: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.authService.logout();
  }

  login() {
    this.formSubmitted = true;
    if (this.username && this.password) {
      this.authService.login({ username: this.username, password: this.password }).subscribe({
        next: (response) => {
          console.log('Login successful : ', response);
          this.notificationService.showSuccess('Login successful');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login failed', err.error.message);
          this.notificationService.showError(err.error.message);
        }
      });
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe({
      next: (response) => {
        debugger;
        localStorage.setItem('token', response.token);
        this.notificationService.showSuccess('Google login successful. If your new user please check your email.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Google login failed', err);
        this.notificationService.showError('Google login failed: ' + (err.error?.message || err.message));
      }
    });
  }
}