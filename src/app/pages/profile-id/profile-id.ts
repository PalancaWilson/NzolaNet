import { Component, OnInit, Input, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { PostCard } from '../../components/post-card/post-card';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { HttpClient } from '@angular/common/http';
import { ModalService } from '../../components/modal/modal.service';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';

interface UtilizadorPerfil {
  id: string;
  nome: string;
  nomeUtilizador: string;
  avatar: string;
  foto_perfil: string;
  foto_capa: string;
  biografia: string;
  seguidores: number;
  a_seguir: number;
  seguindo: number;
  publicacoes: number;
  membro_desde: string;
  emblema?: string;
  privacidade: string;
}

@Component({
  selector: 'app-profile-id',
  imports: [PostCard],
  templateUrl: './profile-id.html',
  styleUrl: './profile-id.css',
})
export class ProfileId implements OnInit {
  private readonly API_URL = environment.apiUrl;

  @Input() id = '';

  utilizador   = signal<UtilizadorPerfil | null>(null);
  tabActiva    = signal<'posts' | 'media' | 'bazes'>('posts');
  estaSeguindo = signal(false);
  carregando   = signal(true);

  postsDoPerfil = computed(() =>
    this.postService.publicacoes().filter(p => p.autor.id === this.utilizador()?.id),
  );
  postsMedia   = computed(() => this.postsDoPerfil().filter(p => !!p.imagem));
  postsBazados = computed(() => this.postService.publicacoes().filter(p => p.gostou));

  constructor(
    readonly postService: PostService,
    private router: Router,
    private http: HttpClient,
    private modal: ModalService,
    readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    if (!this.postService.publicacoes().length) {
      this.postService.obterFeed().subscribe(() => this.carregarUtilizador());
    } else {
      this.carregarUtilizador();
    }
  }

  private carregarUtilizador(): void {
    this.http.get<any>(`${this.API_URL}/utilizadores/${this.id}`).subscribe({
      next: u => {
        this.utilizador.set(u);
        this.estaSeguindo.set(!!u.estaSeguindo);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  toggleSeguir(): void {
    if (this.estaSeguindo()) {
      this.http.delete(`${this.API_URL}/utilizadores/${this.id}/deixar-de-seguir`).subscribe(() => {
        this.estaSeguindo.set(false);
      });
    } else {
      this.http.post(`${this.API_URL}/utilizadores/${this.id}/seguir`, {}).subscribe(() => {
        this.estaSeguindo.set(true);
      });
    }
  }

  abrirMensagem(): void {
    this.router.navigate(['/mensagens'], {
      queryParams: { user: this.utilizador()?.id },
    });
  }

  denunciarConta(): void {
    this.modal.prompt('Denunciar perfil', 'Qual o motivo da denúncia?', '', 'Ex: Perfil falso, conteúdo impróprio...')
      .subscribe(motivo => {
        if (motivo) {
          this.modal.alertar('Denúncia registada', 'A nossa equipa irá analisar. Obrigado!');
        }
      });
  }
}
