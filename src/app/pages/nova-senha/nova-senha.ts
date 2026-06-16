import { Component, signal } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';
import { environment } from '../../../environments/environment';

function senhasIguais(g: AbstractControl): ValidationErrors | null {
  return g.get('senha')?.value === g.get('confirmar')?.value ? null : { diferentes: true };
}

@Component({
  selector: 'app-nova-senha',
  imports: [ReactiveFormsModule, RouterLink, AuthLayout],
  templateUrl: './nova-senha.html',
  styleUrl: './nova-senha.css',
})
export class NovaSenha {
  form: FormGroup;
  mostrar = signal(false);
  carregando = signal(false);
  sucesso = signal(false);
  erro = signal('');
  codigo = '';
  email = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {
    this.codigo = this.route.snapshot.paramMap.get('token') ?? '';
    this.validarCodigo();
    this.form = this.fb.group(
      {
        senha: ['', [Validators.required, Validators.minLength(8)]],
        confirmar: ['', Validators.required],
      },
      { validators: senhasIguais },
    );
  }

  private validarCodigo(): void {
    const raw = localStorage.getItem('nzolanet_recovery');
    if (!raw) {
      this.erro.set('Nenhum código de recuperação encontrado. Pede um novo.');
      return;
    }
    const data = JSON.parse(raw);
    if (data.codigo !== this.codigo) {
      this.erro.set('Código inválido.');
      return;
    }
    if (Date.now() > data.expiracao) {
      this.erro.set('Código expirado. Pede um novo código.');
      localStorage.removeItem('nzolanet_recovery');
      return;
    }
    this.email = data.email;
  }

  guardar(): void {
    this.erro.set('');
    if (this.erro()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.carregando.set(true);

    const senha = this.form.value.senha;

    this.http
      .post<{
        mensagem: string;
      }>(`${environment.apiUrl}/auth/redefinir-senha`, { token: this.codigo, senha })
      .subscribe({
        next: () => {
          localStorage.removeItem('nzolanet_recovery');
          this.carregando.set(false);
          this.sucesso.set(true);
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          localStorage.removeItem('nzolanet_recovery');
          this.carregando.set(false);
          this.sucesso.set(true);
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
      });
  }
}
