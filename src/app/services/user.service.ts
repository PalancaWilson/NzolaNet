import { Injectable, computed, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  foto_perfil: string;
  foto_capa: string;
  biografia: string;
  privacidade: 'publico' | 'privado';
  data_nascimento: string;
  genero: string;
  publicacoes: number;
  seguidores: number;
  a_seguir: number;
  bazes_total: number;
  membro_desde: string;
  admin?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API_URL = environment.apiUrl;

  private _perfil = signal<UserProfile | null>(null);
  readonly perfil = computed(() => this._perfil());

  readonly nome = computed(() => this._perfil()?.nome ?? '');
  readonly email = computed(() => this._perfil()?.email ?? '');
  readonly fotoPerfil = computed(() => this._perfil()?.foto_perfil ?? '');
  readonly biografia = computed(() => this._perfil()?.biografia ?? '');
  readonly privacidade = computed(() => this._perfil()?.privacidade ?? 'publico');
  readonly iniciais = computed(() => {
    const partes = (this._perfil()?.nome ?? 'U').split(' ');
    return partes
      .map((p) => p.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    if (this.auth.estaAutenticado()) {
      this.carregarPerfil();
    }
  }

  carregarPerfil(): void {
    if (!this.auth.estaAutenticado()) return;
    this.http
      .get<UserProfile>(`${this.API_URL}/utilizadores/me`)
      .pipe(
        tap((p) => this._perfil.set(p)),
        catchError(() => {
          // Fallback: usar dados da sessão
          const sessao = this.auth.utilizadorAtual();
          if (sessao) {
            this._perfil.set({
              id: sessao.id,
              nome: sessao.nome,
              email: sessao.email,
              foto_perfil: sessao.foto_perfil ?? '',
              foto_capa: sessao.foto_capa ?? '',
              biografia: '',
              privacidade: 'publico',
              data_nascimento: '',
              genero: '',
              publicacoes: 0,
              seguidores: 0,
              a_seguir: 0,
              bazes_total: 0,
              membro_desde: '',
              admin: sessao.admin ?? false,
            });
          }
          return of(null);
        }),
      )
      .subscribe();
  }

  atualizarPerfil(dados: Partial<UserProfile>): Observable<UserProfile> {
    return this.http
      .put<UserProfile>(`${this.API_URL}/utilizadores/${this._perfil()?.id}`, dados)
      .pipe(tap((p) => this._perfil.set(p)));
  }

  limpar(): void {
    this._perfil.set(null);
  }
}
