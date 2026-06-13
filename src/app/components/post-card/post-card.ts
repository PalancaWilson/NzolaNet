import { Component, Input, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { ModalService } from '../modal/modal.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css'],
})
export class PostCard {
  @Input({ required: true }) post!: Post;

  menuAberto = signal(false);

  constructor(
    private postService: PostService,
    readonly userService: UserService,
    private modal: ModalService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  get isOwner(): boolean {
    return this.post.autor.id === this.userService.perfil()?.id;
  }

  getInitials(): string {
    if (!this.post?.autor?.nome) return '?';
    return this.post.autor.nome
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  toggleMenu(): void {
    this.menuAberto.update(v => !v);
  }

  fecharMenu(): void {
    this.menuAberto.set(false);
  }

  editar(): void {
    this.fecharMenu();
    this.modal.prompt('Editar publicação', 'Altera o texto da tua publicação:', this.post.conteudo, 'Escreve o novo texto...')
      .subscribe(novo => {
        if (novo && novo.trim() !== this.post.conteudo) {
          this.postService.editarPost(this.post.id, novo.trim()).subscribe();
        }
      });
  }

  apagar(): void {
    this.fecharMenu();
    this.modal.confirmar('Apagar publicação', 'Tens a certeza que queres apagar esta publicação? Esta ação não pode ser desfeita.', { confirmar: 'Apagar', cancelar: 'Manter' })
      .subscribe(confirmado => {
        if (confirmado) {
          this.postService.apagarPost(this.post.id).subscribe();
        }
      });
  }

  toggleLike(): void {
    this.postService.toggleBaze(this.post.id).subscribe();
  }

  toggleGuardar(): void {
    this.postService.toggleGuardar(this.post.id).subscribe();
  }

  onComment(): void {
    window.location.href = `/post/${this.post.id}`;
  }

  repostar(): void {
    this.modal.confirmar('Repostar', 'Repostar esta publicação no teu feed?', { confirmar: 'Repostar', cancelar: 'Cancelar' })
      .subscribe(confirmado => {
        if (confirmado) {
          this.postService.repostar(this.post.id).subscribe();
        }
      });
  }

  onShare(): void {
    const url = `${window.location.origin}/post/${this.post.id}`;
    if (navigator.share) {
      navigator.share({ title: this.post.autor.nome, text: this.post.conteudo, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  }

  denunciar(): void {
    this.modal.prompt('Denunciar publicação', 'Qual o motivo da denúncia?', '', 'Ex: Spam, ofensivo...')
      .subscribe(motivo => {
        if (motivo) {
          this.modal.alertar('Denúncia registada', 'Obrigado por ajudar a manter a comunidade segura!');
        }
      });
  }
}
