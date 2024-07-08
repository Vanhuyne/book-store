import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{
  token  : string = '';
  newPassword : string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToastrService
  ){}
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';  
  }

  resetPassword(){
    this.authService.resetPassword(this.token, this.newPassword).subscribe(
      response => {
        this.toastService.success(response);
      },
      error => {
        this.toastService.error(error.error);
        console.log(error);
      }
    );
  }
}
