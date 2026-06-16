import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';

@Component({
  selector: 'app-recuperar-senha',
  imports: [ReactiveFormsModule, RouterLink, AuthLayout],
  templateUrl: './recuperar-senha.html',
  styleUrl: './recuperar-senha.css',
})
export class RecuperarSenha {
  form: FormGroup;
  enviado    = signal(false);
  carregando = signal(false);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  get emailCtrl() { return this.form.get('email')!; }

  enviar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.carregando.set(true);
    // TODO: this.http.post('/api/recuperar-senha', this.form.value).subscribe(...)
    setTimeout(() => {
      this.carregando.set(false);
      this.enviado.set(true);
    }, 1200);
  }
}
