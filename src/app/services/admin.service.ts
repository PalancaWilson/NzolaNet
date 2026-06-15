import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  nomeUtilizador: string;
  avatar: string;
  biografia: string;
  privacidade: 'publico' | 'privado';
  estaBloqueado: boolean;
  publicacoes: number;
  seguidores: number;
  a_seguir: number;
  membro_desde: string;
}

export interface AdminComment {
  id: string;
  texto: string;
  autor: { id: string; nome: string; username: string; avatar: string };
  publicacaoId: string;
  publicacaoConteudo: string;
  tempo: string;
  bazes: number;
}

export interface AdminStats {
  totalUtilizadores: number;
  totalPublicacoes: number;
  totalComentarios: number;
  totalBazes: number;
  utilizadoresHoje: number;
  publicacoesHoje: number;
  denunciasPendentes: number;
}

export interface AdminDenuncia {
  id: string;
  denunciante: { id: string; nome: string; avatar: string } | null;
  conteudo: {
    tipo: 'publicacao' | 'comentario' | 'utilizador';
    id: string;
    texto?: string;
    nome?: string;
    email?: string;
    autor?: { id: string; nome: string };
  } | null;
  motivo: string;
  status: 'pendente' | 'resolvido' | 'rejeitado';
  criadoEm: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API_URL = environment.apiUrl;

  private _utilizadores = signal<AdminUser[]>([]);
  readonly utilizadores = this._utilizadores.asReadonly();

  private _publicacoes = signal<Post[]>([]);
  readonly publicacoes = this._publicacoes.asReadonly();

  private _comentarios = signal<AdminComment[]>([]);
  readonly comentarios = this._comentarios.asReadonly();

  private _estatisticas = signal<AdminStats | null>(null);
  readonly estatisticas = this._estatisticas.asReadonly();

  private _denuncias = signal<AdminDenuncia[]>([]);
  readonly denuncias = this._denuncias.asReadonly();

  private _denunciasPendentes = signal<number>(0);
  readonly denunciasPendentes = this._denunciasPendentes.asReadonly();

  constructor(private http: HttpClient) {}

  obterEstatisticas(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.API_URL}/admin/estatisticas`).pipe(
      tap((s) => this._estatisticas.set(s)),
      catchError(() => {
        this._estatisticas.set(null);
        return of(null as unknown as AdminStats);
      }),
    );
  }

  listarUtilizadores(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.API_URL}/admin/utilizadores`).pipe(
      tap((u) => this._utilizadores.set(u)),
      catchError(() => {
        this._utilizadores.set([]);
        return of([]);
      }),
    );
  }

  bloquearUtilizador(id: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/admin/utilizadores/${id}/bloquear`, {}).pipe(
      tap(() => {
        this._utilizadores.update((lista) =>
          lista.map((u) => (u.id === id ? { ...u, estaBloqueado: true } : u)),
        );
      }),
    );
  }

  desbloquearUtilizador(id: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/admin/utilizadores/${id}/desbloquear`, {}).pipe(
      tap(() => {
        this._utilizadores.update((lista) =>
          lista.map((u) => (u.id === id ? { ...u, estaBloqueado: false } : u)),
        );
      }),
    );
  }

  removerUtilizador(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/admin/utilizadores/${id}`).pipe(
      tap(() => {
        this._utilizadores.update((lista) => lista.filter((u) => u.id !== id));
      }),
    );
  }

  listarPublicacoes(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.API_URL}/admin/publicacoes`).pipe(
      tap((p) => this._publicacoes.set(p)),
      catchError(() => {
        this._publicacoes.set([]);
        return of([]);
      }),
    );
  }

  removerPublicacao(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/admin/publicacoes/${id}`).pipe(
      tap(() => {
        this._publicacoes.update((lista) => lista.filter((p) => p.id !== id));
      }),
    );
  }

  listarComentarios(): Observable<AdminComment[]> {
    return this.http.get<AdminComment[]>(`${this.API_URL}/admin/comentarios`).pipe(
      tap((c) => this._comentarios.set(c)),
      catchError(() => {
        this._comentarios.set([]);
        return of([]);
      }),
    );
  }

  removerComentario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/admin/comentarios/${id}`).pipe(
      tap(() => {
        this._comentarios.update((lista) => lista.filter((c) => c.id !== id));
      }),
    );
  }

  denunciar(tipo: string, id: string, motivo: string): Observable<any> {
    return this.http.post(`${this.API_URL}/denuncias`, { tipo, id, motivo });
  }

  listarDenuncias(): Observable<AdminDenuncia[]> {
    return this.http.get<AdminDenuncia[]>(`${this.API_URL}/admin/denuncias`).pipe(
      tap((d) => this._denuncias.set(d)),
      catchError(() => {
        this._denuncias.set([]);
        return of([]);
      }),
    );
  }

  contarDenunciasPendentes(): Observable<{ pendentes: number }> {
    return this.http.get<{ pendentes: number }>(`${this.API_URL}/admin/denuncias/pendentes`).pipe(
      tap((r) => this._denunciasPendentes.set(r.pendentes)),
      catchError(() => of({ pendentes: 0 })),
    );
  }

  resolverDenuncia(id: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/admin/denuncias/${id}/resolver`, {}).pipe(
      tap(() => {
        this._denuncias.update((lista) =>
          lista.map((d) => (d.id === id ? { ...d, status: 'resolvido' } : d)),
        );
      }),
    );
  }

  rejeitarDenuncia(id: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/admin/denuncias/${id}/rejeitar`, {}).pipe(
      tap(() => {
        this._denuncias.update((lista) =>
          lista.map((d) => (d.id === id ? { ...d, status: 'rejeitado' } : d)),
        );
      }),
    );
  }

  removerConteudoDenunciado(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/admin/denuncias/${id}/conteudo`).pipe(
      tap(() => {
        this._denuncias.update((lista) =>
          lista.map((d) => (d.id === id ? { ...d, status: 'resolvido' } : d)),
        );
      }),
    );
  }
}
