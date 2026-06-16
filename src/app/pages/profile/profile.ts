import { Component, OnInit, signal, computed, Inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PostCard } from '../../components/post-card/post-card';
import { CreatePost } from '../../components/create-post/create-post';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [PostCard, CreatePost, UpperCasePipe, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  tabActiva = signal<'publicacoes' | 'multimédia' | 'bazes'>('publicacoes');
  capaPreview = signal<string | null>(null);
  mostrarLista = signal<'seguidores' | 'a_seguir' | null>(null);
  get chaveCover(): string {
    return 'nzolanet_cover_' + (this.userService.perfil()?.id ?? '');
  }

  constructor(
    readonly userService: UserService,
    readonly postService: PostService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    effect(() => {
      const capa = this.userService.perfil()?.foto_capa;
      if (capa) this.capaPreview.set(capa);
    });
  }

  ngOnInit(): void {
    this.userService.carregarPerfil();
    if (!this.postService.publicacoes().length) {
      this.postService.obterFeed().subscribe();
    }
    this.carregarCapaLocal();
  }

  private carregarCapaLocal(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const capa = localStorage.getItem(this.chaveCover);
      if (capa && !this.capaPreview()) this.capaPreview.set(capa);
    } catch { /* ignorar */ }
  }

  onCapaSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        this.capaPreview.set(dataUrl);
        this.userService.atualizarPerfil({ foto_capa: dataUrl }).subscribe({
          next: p => {
            if (p.foto_capa && isPlatformBrowser(this.platformId)) {
              localStorage.setItem(this.chaveCover, p.foto_capa);
            }
          },
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onAvatarSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        this.userService.atualizarPerfil({ foto_perfil: dataUrl }).subscribe();
      };
      reader.readAsDataURL(file);
    }
  }

  get meusPosts(): Post[] {
    return this.postService.publicacoes().filter(
      p => p.autor.id === this.userService.perfil()?.id,
    );
  }

  get publicacoesContagem(): number {
    return this.meusPosts.length;
  }

  get postsMultimedia(): Post[] {
    return this.meusPosts.filter(p => !!p.imagem);
  }

  get postsBazados(): Post[] {
    return this.postService.publicacoes().filter(p => p.gostou);
  }

  abrirLista(_tipo: 'seguidores' | 'a_seguir'): void {
    // TODO: carregar do backend quando a API estiver pronta
  }

  fecharLista(): void {
    this.mostrarLista.set(null);
  }

  get dataFormatada(): string {
    const d = this.userService.perfil()?.data_nascimento;
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return ''; }
  }

  get generoLabel(): string {
    const g: Record<string, string> = {
      masculino: 'Masculino', feminino: 'Feminino',
    };
    return g[this.userService.perfil()?.genero ?? ''] ?? '';
  }
}
