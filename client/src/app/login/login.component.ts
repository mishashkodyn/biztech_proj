import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { ApiResponse } from '../models/api-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    RouterLink
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email!: string;
  password!: string;

  hide: boolean = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.authService.me().subscribe();
        this.snackBar.open("Logged in successfully.", "Close", {
          duration: 3000
        })
      },
      error: (error: HttpErrorResponse) => {
        let err = error.error as ApiResponse<string>;

        this.snackBar.open(err.error, "Close", {
          duration: 3000
        });
      },
      complete: () => {
        this.router.navigate(['/']);
      }
    })
  }

  togglePassword(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }
}
