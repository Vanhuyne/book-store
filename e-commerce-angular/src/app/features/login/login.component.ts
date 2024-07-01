import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username : string = '';
  password : string= '';
  formSubmitted: boolean = false; 
  constructor(
    private authService: AuthService,
    private router : Router,
    private notificationService: NotificationService) 
  {

  }

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

  forgotPassword() {
    throw new Error('Method not implemented.');
  }
  
  navigateToRegister() {
      this.router.navigate(['/register']);
   }
  loginWithGoogle() {
    throw new Error('Method not implemented.');
  }
}
