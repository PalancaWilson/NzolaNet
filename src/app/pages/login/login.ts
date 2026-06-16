import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, AuthLayout],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  mostrarPassword = signal(false);
  carregando       = signal(false);
  erroServidor     = signal('');

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(64)],
      ],
    });
  }

  get emailCtrl()    { return this.loginForm.get('email')!; }
  get passwordCtrl() { return this.loginForm.get('senha')!; }

  alternarPassword(): void {
    this.mostrarPassword.update(v => !v);
  }

  entrar(): void {
    this.erroServidor.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.carregando.set(true);

    this.auth.iniciarSessao(this.loginForm.value).subscribe({
      next: () => {
        this.carregando.set(false);
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        this.carregando.set(false);
        this.erroServidor.set(
          err?.message ?? 'Erro ao iniciar sessão. Tenta novamente.'
        );
      },
    });
  }
}
