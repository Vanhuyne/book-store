import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) { }

  private createToastConfig(): Partial<IndividualConfig> {
    return {
      timeOut: 1000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
    };
  }

  showSuccess(message: string) {
    const config = this.createToastConfig();
    this.toastr.success(message, '', config);
  }

  showError(message: string) {
    const config = this.createToastConfig();
    this.toastr.error(message, '', config);
  }
}
