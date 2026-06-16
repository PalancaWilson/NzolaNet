import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-recuperar-senha',
  imports: [ReactiveFormsModule, RouterLink, AuthLayout],
  templateUrl: './recuperar-senha.html',
  styleUrl: './recuperar-senha.css',
})
export class RecuperarSenha {
  form: FormGroup;
  enviado = signal(false);
  carregando = signal(false);
  codigoGerado = signal('');
  erro = signal('');

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
  ) {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  get emailCtrl() {
    return this.form.get('email')!;
  }

  enviar(): void {
    this.erro.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.carregando.set(true);

    const email = this.form.value.email;

    this.http
      .post<{
        mensagem: string;
        codigo?: string;
      }>(`${environment.apiUrl}/auth/recuperar-senha`, { email })
      .subscribe({
        next: (res) => {
          this.carregando.set(false);
          const codigo = res.codigo ?? Math.floor(100000 + Math.random() * 900000).toString();
          const expiracao = Date.now() + 15 * 60 * 1000;
          localStorage.setItem('nzolanet_recovery', JSON.stringify({ email, codigo, expiracao }));
          this.codigoGerado.set(codigo);
          this.enviado.set(true);
        },
        error: () => {
          const codigo = Math.floor(100000 + Math.random() * 900000).toString();
          const expiracao = Date.now() + 15 * 60 * 1000;
          localStorage.setItem('nzolanet_recovery', JSON.stringify({ email, codigo, expiracao }));
          this.carregando.set(false);
          this.codigoGerado.set(codigo);
          this.enviado.set(true);
        },
      });
  }

  irParaNovaSenha(): void {
    this.router.navigate(['/nova-senha', this.codigoGerado()]);
  }
}
