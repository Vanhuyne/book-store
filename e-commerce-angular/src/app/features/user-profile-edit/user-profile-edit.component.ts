import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../models/auth/user-dto';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrl: './user-profile-edit.component.css'
})
export class UserProfileEditComponent implements OnInit {
  user: UserDTO | null = null;
  profileForm!: FormGroup;
  isLoading = false;
  // updateSuccess = false;
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.initForm();
      this.loadUserProfile();
    }

  }

  initForm() {
    this.profileForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.maxLength(20)]],
      address: ['', Validators.maxLength(255)],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,14}$/)]],
      profilePictureUrl: ['']
    });
  }
  loadUserProfile() {
    this.authService.getCurrentUser().subscribe(
      (user: UserDTO | null) => {
        this.user = user;
        this.profileForm.patchValue(user as UserDTO);
        this.authService.setUser(user as UserDTO); // Update the user in AuthService
      },
      error => console.error('Error loading user profile', error)
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.user) {
      this.isLoading = true;
      const updatedUser: UserDTO = { ...this.user, ...this.profileForm.value };

      // If a new file is selected, upload it first
      if (this.selectedFile) {
        this.authService.updateProfilePicture(this.selectedFile).subscribe(
          (response: string) => {
            updatedUser.profilePictureUrl = response;
            this.updateProfile(updatedUser);
            this.toastr.success('Profile updated successfully');
            this.authService.setUser(updatedUser);
          },
          error => {
            this.isLoading = false;
            this.toastr.error('Error uploading profile picture');
          }
        );
      } else {
        this.updateProfile(updatedUser);
        this.toastr.success('Profile updated successfully');
      }
    }
  }

  private updateProfile(updatedUser: UserDTO) {
    this.authService.updateProfile(updatedUser).subscribe(
      (response: UserDTO) => {
        this.authService.setUser(response);
        this.isLoading = false;
      },
      error => {
        this.toastr.error('Error updating profile');
        this.isLoading = false;
      }
    );
  }

  get f() { return this.profileForm.controls; }
}
