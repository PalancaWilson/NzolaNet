import { Component, signal } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';

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
  mostrar    = signal(false);
  carregando = signal(false);
  sucesso    = signal(false);
  token      = '';

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.form  = this.fb.group(
      {
        senha:    ['', [Validators.required, Validators.minLength(8)]],
        confirmar:['', Validators.required],
      },
      { validators: senhasIguais }
    );
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.carregando.set(true);
    // TODO: this.http.post('/api/nova-senha', { token: this.token, senha: this.form.value.senha })
    setTimeout(() => {
      this.carregando.set(false);
      this.sucesso.set(true);
      setTimeout(() => this.router.navigate(['/login']), 2000);
    }, 1200);
  }
}
