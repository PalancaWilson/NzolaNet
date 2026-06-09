import { Component, signal, inject } from '@angular/core'; // 1. Adiciona o 'inject' aqui
import { AuthLayout } from "../../layouts/auth-layout/auth-layout";
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LocalStorageUserService } from '../../services/storage_user.service';

function senhasIguaisValidator(group: AbstractControl): ValidationErrors | null {
  const senha    = group.get('senha')?.value;
  const confirma = group.get('confirmarSenha')?.value;
  return senha === confirma ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-register',
  imports: [AuthLayout, RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {


  registerForm: FormGroup;
  mostrarSenha    = signal(false);
  carregando      = signal(false);
  erroServidor    = signal('');
  sucessoRegisto  = signal(false);
  fotoPreview     = signal<string>('assets/imagens/avatar-default.png');
  etapaActual     = signal<1 | 2>(1); // formulário em 2 etapas

  constructor(
      
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private localUsers: LocalStorageUserService
  ) {
    
    this.registerForm = this.fb.group(
      {
       
        nome:            ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        email:           ['', [Validators.required, Validators.email]],
        senha:           ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
        confirmarSenha:  ['', Validators.required],

      
        data_nascimento: [''],
        genero:          [''],
        localizacao:      [''],
        biografia:             ['', Validators.maxLength(160)],
        privacidade:     ['publico'],
        foto_perfil:     [''],   
      },
      { validators: senhasIguaisValidator }
    );
  }

 campo(nome: string) { return this.registerForm.get(nome)!; }

  alternarSenha(): void { this.mostrarSenha.update(v => !v); }

  get forcaSenha(): 'fraca' | 'media' | 'forte' {
    const len = this.campo('senha').value?.length ?? 0;
    if (len < 8)  return 'fraca';
    if (len < 12) return 'media';
    return 'forte';
  }

  get bioRestantes(): number {
    return 160 - (this.campo('bio').value?.length ?? 0);
  }

  // ── Foto de perfil ──────────────────────────────────────────────────────────

  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;

    // Validar tipo e tamanho (máx 2 MB)
    if (!file.type.startsWith('image/')) {
      this.erroServidor.set('O ficheiro deve ser uma imagem.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.erroServidor.set('A imagem não pode exceder 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      this.fotoPreview.set(base64);
      this.campo('foto_perfil').setValue(base64);
    };
    reader.readAsDataURL(file);
  }

  // ── Navegação entre etapas ──────────────────────────────────────────────────

  verificarEmailDuplicado(): void {
    const ctrl = this.campo('email');
    if (ctrl.invalid || !ctrl.value) return;
    if (this.localUsers.emailEmUso(ctrl.value)) {
      ctrl.setErrors({ emailDuplicado: true });
    }
  }

  avancarEtapa(): void {
    // Marcar apenas os campos da etapa 1
    ['nome', 'email', 'senha', 'confirmarSenha'].forEach(c =>
      this.campo(c).markAsTouched()
    );

    const etapa1Valida =
      this.campo('nome').valid &&
      this.campo('email').valid &&
      this.campo('senha').valid &&
      this.campo('confirmarSenha').valid &&
      !this.registerForm.errors?.['senhasDiferentes'];

    if (etapa1Valida) this.etapaActual.set(2);
  }

  voltarEtapa(): void { this.etapaActual.set(1); }

  // ── Submissão final ─────────────────────────────────────────────────────────

  criar(): void {
    this.erroServidor.set('');

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.carregando.set(true);

    // Remover confirmarSenha — não existe no backend
    const { confirmarSenha, ...payload } = this.registerForm.value;

    this.auth.register(payload).subscribe({
      next: () => {
        this.carregando.set(false);
        this.sucessoRegisto.set(true);
        setTimeout(() => this.router.navigate(['/feed']), 1500);
      },
      error: (err) => {
        this.carregando.set(false);
        this.erroServidor.set(err?.message ?? 'Erro ao criar conta. Tenta novamente.');
      },
    });
  }
}