import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from "../components/button/button.component";

@Component({
  selector: 'app-register',
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    RouterLink,
    ButtonComponent
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email!: string;
  password!: string;
  username!: string;
  name!: string;
  surname!: string;
  profilePicture: string = 'https://randomuser.me/api/portraits/lego/5.jpg';
  profileImage: File | null = null;
  hide: boolean = false;

  constructor(
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  togglePassword(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.profileImage = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicture = e.target!.result as string;
        console.log(e.target?.result);
      };

      reader.readAsDataURL(file);

      console.log(this.profilePicture);
    }
  }

  register() {
    this.authService.isLoading.set(true);
    let formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('name', this.name);
    formData.append('surname', this.surname);
    formData.append('username', this.username);
    formData.append('profileImage', this.profileImage!);

    this.authService.register(formData).subscribe({
      next: () => {
        this.snackBar.open('User registered successfully.', 'Close', {
          duration: 3000
        });
        this.authService.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        let err = error.error as ApiResponse<string>;
        this.snackBar.open(err.error, 'Close', {
          duration: 3000
        });
        this.authService.isLoading.set(false);
      },
      complete: () => {
        this.router.navigate(['/']);
        this.authService.isLoading.set(false);
      },
    });
  }
}
