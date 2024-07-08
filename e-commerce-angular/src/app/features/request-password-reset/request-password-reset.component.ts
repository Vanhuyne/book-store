import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrl: './request-password-reset.component.css'
})
export class RequestPasswordResetComponent {
  email : string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastr: ToastrService
  ) { }

  requestPasswordReset() {
    this.authService.requestPasswordReset(this.email).subscribe((response) => {
        this.toastr.success(response);
    },
    (error) => {
      console.log(error);
      
      this.toastr.error(error.error);
    });
  }
}
