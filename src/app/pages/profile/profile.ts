import { Component , OnInit, signal } from '@angular/core';
import { Sidebar} from '../../components/sidebar/sidebar';
import { Topbar } from '../../components/topbar/topbar';
import { PostCard } from '../../components/post-card/post-card';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [Sidebar, Topbar, PostCard, RouterLink, UpperCasePipe ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  tabActiva = signal<'publicacoes' | 'multimédia' | 'bazes'>('publicacoes');

  constructor(
    readonly userService: UserService,
    readonly postService: PostService
  ) {}

  ngOnInit(): void {
    // Garantir que o perfil e posts estão carregados
    this.userService.carregarPerfil();
    if (!this.postService.posts().length) {
      this.postService.getFeed().subscribe();
    }
  }

  // Posts do utilizador autenticado (filtra pelo id da sessão)
  get meusPosts(): Post[] {
    return this.postService.posts().filter(
      p => p.author.id === this.userService.perfil()?.id
    );
  }

  // Posts com imagem
  get postsMultimedia(): Post[] {
    return this.meusPosts.filter(p => !!p.image);
  }

  // Posts que o utilizador deu baze
  get postsBazados(): Post[] {
    return this.postService.posts().filter(p => p.liked);
  }

  // Formatar data de nascimento legível
  get dataFormatada(): string {
    const d = this.userService.perfil()?.data_nascimento;
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return ''; }
  }

  // Género legível
  get generoLabel(): string {
    const g: Record<string, string> = {
      masculino: 'Masculino', feminino: 'Feminino',
      nao_binario: 'Não-binário', outro: 'Outro',
    };
    return g[this.userService.perfil()?.genero ?? ''] ?? '';
  }
}
