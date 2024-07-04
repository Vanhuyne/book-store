import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  socialUser!: SocialUser;
  public user: SocialUser = new SocialUser();

  username : string = '';
  password : string= '';
  formSubmitted: boolean = false; 
  constructor(
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private router : Router,
    private notificationService: NotificationService,
    private socialAuth:  SocialAuthService) {}

  login(){
    this.formSubmitted = true;
    if (this.username && this.password) {
      this.authService.login({username: this.username, password: this.password}).subscribe({ 
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
  ngOnInit(): void {
    this.socialAuth.authState.subscribe((user: SocialUser) => {
      console.log(user);
      // Handle user data here
    });
  }

  loginWithGoogle(): void {
    this.socialAuth.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
