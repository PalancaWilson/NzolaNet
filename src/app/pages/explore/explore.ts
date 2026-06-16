import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { PostCard } from '../../components/post-card/post-card';
import { PostService } from '../../services/post.service';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

type Categoria = 'tudo' | 'pessoas' | 'posts' | 'tendencias';

@Component({
  selector: 'app-explore',
  imports: [RouterLink, PostCard, DecimalPipe],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
})
export class Explore implements OnInit {
  private readonly API_URL = environment.apiUrl;

  categoria   = signal<Categoria>('tudo');
  termoPesq   = signal('');
  seguindoMap = signal<Record<string, boolean>>({});

  utilizadores: User[] = [];
  todosPosts:   Post[] = [];

  tendencias = [
    { tag: 'angola',       posts: 1240 },
    { tag: 'luanda',       posts: 890  },
    { tag: 'criatividade', posts: 670  },
    { tag: 'design',       posts: 540  },
    { tag: 'musica',       posts: 430  },
    { tag: 'fotografia',   posts: 380  },
    { tag: 'tecnologia',   posts: 310  },
    { tag: 'cultura',      posts: 280  },
  ];

  utilizadoresFiltrados = computed(() => {
    const t = this.termoPesq().toLowerCase();
    return t ? this.utilizadores.filter(u =>
      u.nome.toLowerCase().includes(t) || u.nomeUtilizador.toLowerCase().includes(t)
    ) : this.utilizadores;
  });

  postsFiltrados = computed(() => {
    const t = this.termoPesq().toLowerCase();
    return t ? this.todosPosts.filter(p =>
      p.conteudo.toLowerCase().includes(t) ||
      p.etiquetas?.some(tg => tg.toLowerCase().includes(t))
    ) : this.todosPosts;
  });

  tendenciasFiltradas = computed(() => {
    const t = this.termoPesq().toLowerCase();
    return t ? this.tendencias.filter(tr => tr.tag.includes(t)) : this.tendencias;
  });

  constructor(
    readonly postService: PostService,
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.http.get<User[]>(`${this.API_URL}/utilizadores`).subscribe(u => this.utilizadores = u ?? []);
    if (!this.postService.publicacoes().length) this.postService.obterFeed().subscribe();
    this.postService.publicacoes().length && (this.todosPosts = this.postService.publicacoes());
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      if (q) this.termoPesq.set(q);
    });
  }

  pesquisar(v: string): void { this.termoPesq.set(v); }
  toggleSeguir(id: string): void { this.seguindoMap.update(m => ({ ...m, [id]: !m[id] })); }
  estaSeguindo(id: string): boolean { return !!this.seguindoMap()[id]; }
}
