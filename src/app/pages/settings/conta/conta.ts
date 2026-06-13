import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-conta',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './conta.html',
  styleUrl: './conta.css',
})
export class Conta {
  nome = signal('');
  email = signal('');
  senha = signal('');
  salvando = signal(false);
  salvo = signal(false);

  constructor(readonly userService: UserService) {
    const perfil = this.userService.perfil();
    if (perfil) {
      this.nome.set(perfil.nome);
      this.email.set(perfil.email);
    }
  }

  salvar(): void {
    const dados: Record<string, string> = {};
    const nome = this.nome().trim();
    const email = this.email().trim();
    const senha = this.senha().trim();

    if (nome) dados['nome'] = nome;
    if (email) dados['email'] = email;
    if (senha) dados['senha'] = senha;
    if (!nome && !email && !senha) return;

    this.salvando.set(true);
    this.salvo.set(false);

    this.userService.atualizarPerfil(dados).subscribe(() => {
      this.salvando.set(false);
      this.salvo.set(true);
      this.senha.set('');
      setTimeout(() => this.salvo.set(false), 3000);
    });
  }
}
