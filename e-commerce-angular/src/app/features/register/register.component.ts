import { Component } from '@angular/core';
import { UserRegistrationDTO } from '../../models/auth/user-registration-dto';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDTO } from '../../models/auth/user-dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user : UserRegistrationDTO = {
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: ''
  }
  formSubmitted = false;
  errors: any = {};
  constructor(
    private authService: AuthService,
    private router : Router,
    private toastrService : ToastrService
  ) { }

  register(){
      this.formSubmitted = true;
      this.errors = {}; // Reset errors
      if (this.user.username && this.user.password && this.user.email && this.user.firstName && this.user.lastName) {
        this.authService.register(this.user).subscribe({
          next: () => {
            this.toastrService.success('Registration successful! Please login to continue.')
            this.router.navigate(['/login']);
          },
          error: (error) => {
            if (error.status === 400 && error.error && typeof error.error === 'string') {
              const errorMessages = error.error.split(';');
                errorMessages.forEach((errorMessage: string) => {
                  const fieldName = errorMessage.split(' ')[0]; // Assuming the field name is the first word
                  this.errors[fieldName.toLowerCase()] = errorMessage;
      
              });
            } else {
              this.toastrService.error(error.error.message)
              console.error(error);
            }
          }
        });
      }
    }

  
}
