import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title: string = 'Success') {
    const config: Partial<IndividualConfig> = {
      timeOut: 1500,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',

    };
    this.toastr.success(message, title, config);
  }
  showError(message: string, title: string = 'Error') {
    const config: Partial<IndividualConfig> = {
      timeOut: 1500,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
    };
    this.toastr.error(message, title, config);
  }
}
