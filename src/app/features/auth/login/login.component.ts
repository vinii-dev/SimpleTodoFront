import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { AuthFacade } from '../../../core/auth/auth.facade';
import { ERROR_MESSAGES } from '../../../shared/constants/error-codes';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: []
})
export class LoginComponent {
  loginForm = inject(FormBuilder).group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loading = false;

  private authFacade = inject(AuthFacade);
  private router = inject(Router);
  private messageService = inject(MessageService);

  onSubmit() {
    if (this.loginForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;

    this.authFacade.login(username!, password!).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {}
    }).add(() => this.loading = false);
  }

  private markAllAsTouched() {
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }
}
