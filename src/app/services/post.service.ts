import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly API_URL = environment.apiUrl;
  private _publicacoes = signal<Post[]>([]);
  readonly publicacoes = this._publicacoes.asReadonly();

  constructor(private http: HttpClient) {}

  obterFeed(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.API_URL}/publicacoes`).pipe(
      tap(posts => this._publicacoes.set(posts)),
      catchError(() => {
        this._publicacoes.set([]);
        return of([]);
      }),
    );
  }

  obterPorId(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.API_URL}/publicacoes/${id}`);
  }

  obterPorUtilizador(utilizadorId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.API_URL}/utilizadores/${utilizadorId}/publicacoes`).pipe(
      catchError(() => of([])),
    );
  }

  criarPost(conteudo: string, imagem?: string): Observable<Post> {
    return this.http.post<Post>(`${this.API_URL}/publicacoes`, { conteudo, imagem }).pipe(
      tap(novo => this._publicacoes.update(lista => [novo, ...lista])),
    );
  }

  editarPost(postId: string, conteudo: string): Observable<Post> {
    return this.http.put<Post>(`${this.API_URL}/publicacoes/${postId}`, { conteudo }).pipe(
      tap(actualizado => {
        this._publicacoes.update(lista =>
          lista.map(p => (p.id === postId ? actualizado : p)),
        );
      }),
    );
  }

  apagarPost(postId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/publicacoes/${postId}`).pipe(
      tap(() => {
        this._publicacoes.update(lista => lista.filter(p => p.id !== postId));
      }),
    );
  }

  toggleBaze(postId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/publicacoes/${postId}/baze`, {}).pipe(
      tap(() => {
        this._publicacoes.update(lista =>
          lista.map(p =>
            p.id === postId
              ? { ...p, gostou: !p.gostou, gostos: p.gostou ? p.gostos - 1 : p.gostos + 1 }
              : p,
          ),
        );
      }),
    );
  }

  toggleGuardar(postId: string): Observable<void> {
    // TODO: implementar endpoint de guardar quando o backend estiver pronto
    this._publicacoes.update(lista =>
      lista.map(p =>
        p.id === postId ? { ...p, guardado: !p.guardado } : p,
      ),
    );
    return of(void 0);
  }

  repostar(postId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/publicacoes/${postId}/repostar`, {}).pipe(
      tap(() => {
        this._publicacoes.update(lista =>
          lista.map(p =>
            p.id === postId ? { ...p, partilhas: p.partilhas + 1 } : p,
          ),
        );
      }),
      catchError(() => {
        // fallback local
        this._publicacoes.update(lista =>
          lista.map(p =>
            p.id === postId ? { ...p, partilhas: p.partilhas + 1 } : p,
          ),
        );
        return of(void 0);
      }),
    );
  }
}
