import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService, AdminComment } from '../../../services/admin.service';
import { ModalService } from '../../../components/modal/modal.service';

@Component({
  selector: 'app-admin-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-comments.html',
  styleUrl: './admin-comments.css',
})
export class AdminComments implements OnInit {
  pesquisa = signal('');
  carregando = signal(true);

  constructor(
    readonly adminService: AdminService,
    private modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.adminService.listarComentarios().subscribe({
      complete: () => this.carregando.set(false),
    });
  }

  get comentariosFiltrados(): AdminComment[] {
    const q = this.pesquisa().toLowerCase().trim();
    if (!q) return this.adminService.comentarios();
    return this.adminService
      .comentarios()
      .filter(
        (c) =>
          c.texto.toLowerCase().includes(q) ||
          c.autor.nome.toLowerCase().includes(q) ||
          c.publicacaoConteudo.toLowerCase().includes(q),
      );
  }

  confirmarRemover(c: AdminComment): void {
    this.modal
      .confirmar(
        'Remover comentário',
        `Tens a certeza que queres remover o comentário de ${c.autor.nome}? Esta ação não pode ser desfeita.`,
        { confirmar: 'Remover', cancelar: 'Cancelar' },
      )
      .subscribe((confirmado) => {
        if (!confirmado) return;
        this.adminService.removerComentario(c.id).subscribe();
      });
  }
}
