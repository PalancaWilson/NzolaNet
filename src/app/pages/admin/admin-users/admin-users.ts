import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService, AdminUser } from '../../../services/admin.service';
import { ModalService } from '../../../components/modal/modal.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  pesquisa = signal('');
  carregando = signal(true);

  constructor(
    readonly adminService: AdminService,
    private modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.adminService.listarUtilizadores().subscribe({
      complete: () => this.carregando.set(false),
    });
  }

  get utilizadoresFiltrados(): AdminUser[] {
    const q = this.pesquisa().toLowerCase().trim();
    if (!q) return this.adminService.utilizadores();
    return this.adminService
      .utilizadores()
      .filter(
        (u) =>
          u.nome.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.nomeUtilizador && u.nomeUtilizador.toLowerCase().includes(q)),
      );
  }

  confirmarBloquear(u: AdminUser): void {
    const acao = u.estaBloqueado ? 'desbloquear' : 'bloquear';
    this.modal
      .confirmar(
        `${acao === 'bloquear' ? 'Bloquear' : 'Desbloquear'} utilizador`,
        `Tens a certeza que queres ${acao} ${u.nome}?`,
        { confirmar: acao === 'bloquear' ? 'Bloquear' : 'Desbloquear', cancelar: 'Cancelar' },
      )
      .subscribe((confirmado) => {
        if (!confirmado) return;
        if (u.estaBloqueado) {
          this.adminService.desbloquearUtilizador(u.id).subscribe();
        } else {
          this.adminService.bloquearUtilizador(u.id).subscribe();
        }
      });
  }

  confirmarRemover(u: AdminUser): void {
    this.modal
      .confirmar(
        'Remover utilizador',
        `Tens a certeza que queres remover ${u.nome} permanentemente? Esta ação não pode ser desfeita.`,
        { confirmar: 'Remover', cancelar: 'Cancelar' },
      )
      .subscribe((confirmado) => {
        if (!confirmado) return;
        this.adminService.removerUtilizador(u.id).subscribe();
      });
  }
}
