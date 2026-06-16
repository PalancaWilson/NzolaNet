import { Component, Input, Output, EventEmitter, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';
import { ModalService } from '../modal/modal.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css'],
})
export class PostCard {
  @Input({ required: true }) post!: Post;
  @Output() editado = new EventEmitter<Post>();

  menuAberto = signal(false);

  editando = signal(false);
  editText = signal('');
  editNovaImagem = signal<string | null>(null);
  removerImagem = signal(false);
  salvando = signal(false);

  readonly limite = 1024;

  constructor(
    private postService: PostService,
    readonly userService: UserService,
    private modal: ModalService,
    private adminService: AdminService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  get isOwner(): boolean {
    return this.post.autor.id === this.userService.perfil()?.id;
  }

  get restantes(): number {
    return this.limite - this.editText().length;
  }
  get quaseNoLimite(): boolean {
    return this.restantes <= 80;
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
    this.menuAberto.update((v) => !v);
  }

  fecharMenu(): void {
    this.menuAberto.set(false);
  }

  iniciarEdicao(): void {
    this.fecharMenu();
    this.editText.set(this.post.conteudo);
    this.editNovaImagem.set(null);
    this.removerImagem.set(false);
    this.editando.set(true);
  }

  cancelarEdicao(): void {
    this.editando.set(false);
    this.editText.set('');
    this.editNovaImagem.set(null);
    this.removerImagem.set(false);
  }

  onEditImageSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.editNovaImagem.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  removerEditImagem(): void {
    this.editNovaImagem.set(null);
    this.removerImagem.set(true);
  }

  guardarEdicao(): void {
    const texto = this.editText().trim();
    if (!texto || texto === this.post.conteudo) {
      this.cancelarEdicao();
      return;
    }
    this.salvando.set(true);
    let imagem: string | null | undefined = undefined;
    if (this.removerImagem()) {
      imagem = null;
    } else if (this.editNovaImagem()) {
      imagem = this.editNovaImagem();
    }
    this.postService.editarPost(this.post.id, texto, imagem).subscribe({
      next: (actualizado) => {
        this.editado.emit(actualizado);
        this.editando.set(false);
        this.salvando.set(false);
      },
      error: () => {
        this.salvando.set(false);
      },
    });
  }

  apagar(): void {
    this.fecharMenu();
    this.modal
      .confirmar(
        'Apagar publicação',
        'Tens a certeza que queres apagar esta publicação? Esta ação não pode ser desfeita.',
        { confirmar: 'Apagar', cancelar: 'Manter' },
      )
      .subscribe((confirmado) => {
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
    this.modal
      .confirmar('Repostar', 'Repostar esta publicação no teu feed?', {
        confirmar: 'Repostar',
        cancelar: 'Cancelar',
      })
      .subscribe((confirmado) => {
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
    this.modal
      .prompt('Denunciar publicação', 'Qual o motivo da denúncia?', '', 'Ex: Spam, ofensivo...')
      .subscribe((motivo) => {
        if (motivo && motivo.length >= 10) {
          this.adminService.denunciar('publicacao', this.post.id, motivo).subscribe({
            next: () =>
              this.modal.alertar(
                'Denúncia registada',
                'Obrigado por ajudar a manter a comunidade segura!',
              ),
            error: () =>
              this.modal.alertar('Erro', 'Não foi possível registar a denúncia. Tenta novamente.'),
          });
        } else if (motivo) {
          this.modal.alertar('Motivo muito curto', 'O motivo deve ter pelo menos 10 caracteres.');
        }
      });
  }
}
