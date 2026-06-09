import { Injectable, computed, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { LocalStorageUserService, UtilizadorLocal } from './storage_user.service';

// Perfil completo — espelha a tabela users do Laravel
export interface UserProfile {
  id:              string;
  nome:            string;
  email:           string;
  foto_perfil:     string;
  biografia:       string;
  privacidade:     'publico' | 'privado';
  data_nascimento: string;
  genero:          string;
  // campos calculados (virão do backend)
  publicacoes:     number;
  seguidores:      number;
  a_seguir:        number;
  bazes_total:     number;
  membro_desde:    string;
}

@Injectable({ providedIn: 'root' })
export class UserService {

  private readonly API_URL = 'https://api.nzolanet.app/api';

  // Signal com o perfil completo do utilizador autenticado
  private _perfil = signal<UserProfile | null>(null);
  readonly perfil  = computed(() => this._perfil());

  // Campos individuais para uso direto nos templates
  readonly nome        = computed(() => this._perfil()?.nome        ?? '');
  readonly email       = computed(() => this._perfil()?.email       ?? '');
  readonly fotoPerfil  = computed(() => this._perfil()?.foto_perfil ?? 'https://i.pravatar.cc/150?img=60');
  readonly biografia   = computed(() => this._perfil()?.biografia   ?? '');
  readonly privacidade = computed(() => this._perfil()?.privacidade ?? 'publico');
  readonly iniciais    = computed(() => {
    const partes = (this._perfil()?.nome ?? 'U').split(' ');
    return partes.map(p => p.charAt(0)).join('').toUpperCase().slice(0, 2);
  });

  constructor(
    private auth: AuthService,
    private localUsers: LocalStorageUserService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // Carregar perfil quando há sessão activa
    if (this.auth.isLoggedIn()) {
      this.carregarPerfil();
    }
  }

  // Carrega o perfil completo (local por agora, HTTP depois)
  carregarPerfil(): void {
    const sessao = this.auth.currentUser();
    if (!sessao) return;

    // TODO: quando o backend estiver pronto:
    // this.http.get<UserProfile>(`${this.API_URL}/me`).subscribe(p => this._perfil.set(p));

    // Procurar dados completos no localStorage
    const local = this.localUsers.obterTodos().find(u => u.id === sessao.id);

    if (local) {
      this._perfil.set(this.mapearUtilizadorLocal(local));
    } else {
      // Utilizador de demo — construir perfil a partir da sessão
      this._perfil.set({
        id:              sessao.id,
        nome:            sessao.nome,
        email:           sessao.email,
        foto_perfil:     sessao.foto_perfil!,
        biografia:       sessao.biografia || 'Criativo • Angolano 🇦🇴',
        privacidade:     sessao.privacidade ?? 'publico',
        data_nascimento: '',
        genero:          '',
        publicacoes:     12,
        seguidores:      248,
        a_seguir:        91,
        bazes_total:     530,
        membro_desde:    this.formatarData(new Date().toISOString()),
      });
    }
  }

  // Atualizar perfil (campos do $fillable)
  atualizarPerfil(dados: Partial<UtilizadorLocal>): Observable<UserProfile> {
    // TODO: return this.http.put<UserProfile>(`${this.API_URL}/me`, dados).pipe(
    //   tap(p => this._perfil.set(p))
    // );

    // Atualizar no localStorage
    const todos    = this.localUsers.obterTodos();
    const idx      = todos.findIndex(u => u.id === this._perfil()?.id);
    if (idx !== -1) {
      todos[idx] = { ...todos[idx], ...dados };
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('nzolanet_utilizadores', JSON.stringify(todos));
      }
      this._perfil.update(atual => atual ? { ...atual, ...dados } : atual);
    }
    return of(this._perfil()!);
  }

  // Limpar perfil ao fazer logout
  limpar(): void { this._perfil.set(null); }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private mapearUtilizadorLocal(u: UtilizadorLocal): UserProfile {
    return {
      id:              u.id,
      nome:            u.nome,
      email:           u.email,
      foto_perfil:     u.foto_perfil || 'https://i.pravatar.cc/150?img=60',
      biografia:       u.biografia || '',
      privacidade:     u.privacidade || 'publico',
      data_nascimento: u.data_nascimento || '',
      genero:          u.genero || '',
      // Estatísticas a zero para utilizadores novos
      publicacoes:     0,
      seguidores:      0,
      a_seguir:        0,
      bazes_total:     0,
      membro_desde:    this.formatarData(u.criadoEm),
    };
  }

  formatarData(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
  }
}
