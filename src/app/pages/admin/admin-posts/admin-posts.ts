import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { ModalService } from '../../../components/modal/modal.service';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'app-admin-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-posts.html',
  styleUrl: './admin-posts.css',
})
export class AdminPosts implements OnInit {
  pesquisa = signal('');
  carregando = signal(true);

  constructor(
    readonly adminService: AdminService,
    private modal: ModalService,
  ) {}

  ngOnInit(): void {
    this.adminService.listarPublicacoes().subscribe({
      complete: () => this.carregando.set(false),
    });
  }

  get publicacoesFiltradas(): Post[] {
    const q = this.pesquisa().toLowerCase().trim();
    if (!q) return this.adminService.publicacoes();
    return this.adminService
      .publicacoes()
      .filter(
        (p) => p.conteudo.toLowerCase().includes(q) || p.autor.nome.toLowerCase().includes(q),
      );
  }

  confirmarRemover(p: Post): void {
    this.modal
      .confirmar(
        'Remover publicação',
        `Tens a certeza que queres remover a publicação de ${p.autor.nome}? Esta ação não pode ser desfeita.`,
        { confirmar: 'Remover', cancelar: 'Cancelar' },
      )
      .subscribe((confirmado) => {
        if (!confirmado) return;
        this.adminService.removerPublicacao(p.id).subscribe();
      });
  }
}
