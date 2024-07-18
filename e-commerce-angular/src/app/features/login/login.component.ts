import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';

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
    private socialAuthService: SocialAuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.loginWithGoogle(user);
      }
    });

    this.socialAuthService.initState.subscribe({
      next: (state) => console.log('Google Sign-In initialized:', state),
      error: (error) => console.error('Google Sign-In initialization error:', error)
    });
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

  private loginWithGoogle(user: SocialUser) {
    this.authService.loginWithGoogle(user).subscribe({
      next: (response) => {
        console.log('Google login successful:', response);
        this.notificationService.showSuccess('Google login successful');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Google login failed', err);
        this.notificationService.showError('Google login failed: ' + (err.error?.message || err.message));
      }
    });
  }
}