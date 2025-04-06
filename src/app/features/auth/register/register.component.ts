// register.component.ts
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthFacade } from '../../../core/auth/auth.facade';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ToastModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    CardModule,
    ReactiveFormsModule,
    CommonModule,
    MessageModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm = inject(FormBuilder).group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.passwordMatchValidator
  });

  loading = false;

  private authFacade = inject(AuthFacade);
  private router = inject(Router);

  passwordMatchValidator(formGroup: any) {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { username, password } = this.registerForm.value;

    this.authFacade.register(username!, password!).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {

      }
    }).add(() => this.loading = false);
  }

  private markAllAsTouched() {
    Object.values(this.registerForm.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }
}
