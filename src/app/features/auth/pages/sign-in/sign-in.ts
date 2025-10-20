import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import feather from 'feather-icons';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.scss'],
  imports: [FormsModule,ReactiveFormsModule, CommonModule]
})
export class SignIn implements AfterViewInit {
  mode: 'login' | 'register' = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    feather.replace();
  }

  toggleMode() {
    this.error = null;
    this.mode = this.mode === 'login' ? 'register' : 'login';
  }

  onSubmit(): void {
    if (this.mode === 'login') {
      if (this.loginForm.invalid) return;
      this.login();
    } else {
      if (this.registerForm.invalid) return;
      this.register();
    }
  }

  private login(): void {
    this.loading = true;
    this.error = null;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed. Please try again.';
      },
    });
  }

  private register(): void {
    this.loading = true;
    this.error = null;
    const { name, email, password, phone } = this.registerForm.value;
    const data = {
      name: name,
      email: email,
      password: password,
      phone: phone
    }
    this.authService.register(data).subscribe({
      next: (res) => {
        this.loading = false;
        alert('✅ Registration successful! You can now sign in.');
        this.mode = 'login';
        this.registerForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }
}
