import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage = '';


  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  ngOnInit(): void {}

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    if (this.loginForm.invalid) {
      return;
    }
    console.log('Login Data:', this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res && res.message) {
          this.errorMessage = res.message;
        } else {
          this.successMessage = 'Login successful!';
        }
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Login failed.';
      }
    });
  }
}
