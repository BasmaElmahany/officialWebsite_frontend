import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Role } from '../../Models/role';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  roles: Role[] = [];
  registerForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  ngOnInit(): void {
    this.authService.getRoles().subscribe((roles) => {
      this.roles = roles;
      console.log('Fetched roles:', this.roles);
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    if (this.registerForm.invalid) {
      return;
    }
    console.log('Register Data:', this.registerForm.value);
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        this.registerForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Registration failed.';
      }
    });
  }
}
