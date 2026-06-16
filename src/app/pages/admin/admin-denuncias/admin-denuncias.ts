import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService, AdminDenuncia } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-denuncias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-denuncias.html',
  styleUrl: './admin-denuncias.css',
})
export class AdminDenuncias implements OnInit {
  pesquisa = signal('');
  filtroStatus = signal<string>('');
  carregando = signal(true);
  acaoId = signal<string | null>(null);

  constructor(readonly adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.listarDenuncias().subscribe({
      complete: () => this.carregando.set(false),
    });
  }

  get denunciasFiltradas(): AdminDenuncia[] {
    let lista = this.adminService.denuncias();
    const q = this.pesquisa().toLowerCase().trim();
    if (q) {
      lista = lista.filter(
        (d) =>
          d.motivo.toLowerCase().includes(q) ||
          d.denunciante?.nome.toLowerCase().includes(q) ||
          d.conteudo?.texto?.toLowerCase().includes(q),
      );
    }
    const st = this.filtroStatus();
    if (st) {
      lista = lista.filter((d) => d.status === st);
    }
    return lista;
  }

  setAcao(id: string | null): void {
    this.acaoId.set(id);
  }

  resolver(d: AdminDenuncia): void {
    this.acaoId.set(d.id);
    this.adminService.resolverDenuncia(d.id).subscribe(() => this.acaoId.set(null));
  }

  rejeitar(d: AdminDenuncia): void {
    this.acaoId.set(d.id);
    this.adminService.rejeitarDenuncia(d.id).subscribe(() => this.acaoId.set(null));
  }

  removerConteudo(d: AdminDenuncia): void {
    this.acaoId.set(d.id);
    this.adminService.removerConteudoDenunciado(d.id).subscribe(() => this.acaoId.set(null));
  }

  iconPorTipo(tipo: string): string {
    const map: Record<string, string> = {
      publicacao: 'bi-file-text-fill',
      comentario: 'bi-chat-fill',
      utilizador: 'bi-person-fill',
    };
    return map[tipo] ?? 'bi-question-circle-fill';
  }
}
