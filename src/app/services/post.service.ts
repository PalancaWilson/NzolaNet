import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { MockDataService } from './mock-data.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class PostService {

  private readonly API_URL = 'https://api.nzolanet.app/api';
  private _posts = signal<Post[]>([]);
  readonly posts = this._posts.asReadonly();

  constructor(
    private http: HttpClient,
    private mock: MockDataService,
    private userService: UserService
  ) {}

  // ---------------------------------------------------------------------------
  // Obter feed
  // ---------------------------------------------------------------------------
  getFeed(): Observable<Post[]> {
    // TODO: descomentar quando o backend estiver pronto
    // return this.http.get<Post[]>(`${this.API_URL}/feed`).pipe(
    //   tap(posts => this._posts.set(posts)),
    //   catchError(() => of(this.mock.getPosts()))
    // );
    const posts = this.mock.getPosts();
    this._posts.set(posts);
    return of(posts);
  }

  // ---------------------------------------------------------------------------
  // Dar/retirar baze (like)
  // ---------------------------------------------------------------------------
  toggleBaze(postId: string): Observable<void> {
    this._posts.update(lista =>
      lista.map(p =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );

    // TODO: descomentar quando o backend estiver pronto
    // return this.http.post<void>(`${this.API_URL}/posts/${postId}/baze`, {}).pipe(
    //   catchError(() => of(void 0))
    // );
    return of(void 0);
  }

  // ---------------------------------------------------------------------------
  // Guardar/remover publicação
  // ---------------------------------------------------------------------------
  toggleGuardar(postId: string): Observable<void> {
    this._posts.update(lista =>
      lista.map(p =>
        p.id === postId ? { ...p, saved: !p.saved } : p
      )
    );

    // TODO: descomentar quando o backend estiver pronto
    // return this.http.post<void>(`${this.API_URL}/posts/${postId}/save`, {}).pipe(
    //   catchError(() => of(void 0))
    // );
    return of(void 0);
  }

  // ---------------------------------------------------------------------------
  // Criar publicação
  // ---------------------------------------------------------------------------
  criarPost(conteudo: string, imagem?: string): Observable<Post> {
    // TODO: descomentar quando o backend estiver pronto
    // return this.http.post<Post>(`${this.API_URL}/posts`, { conteudo, imagem }).pipe(
    //   tap(novoPost => this._posts.update(lista => [novoPost, ...lista]))
    // );

    const perfil   = this.userService.perfil();
    const novoPost: Post = {
      id:      'local-' + Date.now(),
      author: {
        id:       perfil?.id       ?? 'me',
        nome:     perfil?.nome     ?? 'Tu',
        username: perfil?.nome?.toLowerCase().replace(/\s+/g, '_') ?? 'eu_user',
        avatar:   perfil?.foto_perfil ?? 'https://i.pravatar.cc/150?img=60',
      },
      content:  conteudo,
      image:    imagem,
      tags:     [],
      likes:    0,
      comments: 0,
      shares:   0,
      saves:    0,
      timeAgo:  'agora mesmo',
      liked:    false,
      saved:    false,
    };

    this._posts.update(lista => [novoPost, ...lista]);
    return of(novoPost);
  }
}