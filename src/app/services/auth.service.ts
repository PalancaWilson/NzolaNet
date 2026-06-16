import { Injectable, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, map } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginPayload, RegisterPayload, AuthResponse } from '../models/auth.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'nzolanet_token';
  private readonly USER_KEY = 'nzolanet_user';

  private _token = signal<string | null>(null);
  private _utilizador = signal<AuthResponse['utilizador'] | null>(null);

  readonly estaAutenticado = computed(() => !!this._token());
  readonly utilizadorAtual = computed(() => this._utilizador());
  readonly token = computed(() => this._token());
  readonly isAdmin = computed(() => this._utilizador()?.admin ?? false);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.restaurarSessao();
  }

  private extrairMensagemErro(err: any, accao: string): string {
    if (err.status === 0) return 'Servidor indisponível. Verifica a tua ligação.';
    if (err.status === 401) return 'Email ou senha incorretos.';
    if (err.status === 422) return err.error?.mensagem ?? 'Dados inválidos. Verifica os campos.';
    if (err.status === 429) return 'Muitas tentativas. Aguarda um momento e tenta novamente.';
    if (err.status >= 500) return 'Erro no servidor. Tenta novamente mais tarde.';
    return err.error?.mensagem ?? `Erro ao ${accao}. Tenta novamente.`;
  }

  iniciarSessao(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, payload).pipe(
      tap((res) => this.guardarSessao(res)),
      catchError((err) => {
        console.error('Erro no login:', err);
        return throwError(() => new Error(this.extrairMensagemErro(err, 'iniciar sessão')));
      }),
    );
  }

  registar(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/registar`, payload).pipe(
      tap((res) => this.guardarSessao(res)),
      catchError((err) => {
        console.error('Erro no registo:', err);
        return throwError(() => new Error(this.extrairMensagemErro(err, 'registar')));
      }),
    );
  }

  verificarEmail(email: string): Observable<boolean> {
    return this.http
      .get<{ disponivel: boolean }>(`${this.API_URL}/auth/verificar-email`, {
        params: { email },
      })
      .pipe(map((r) => r.disponivel));
  }

  verificarNome(nome: string): Observable<boolean> {
    return this.http
      .get<{ disponivel: boolean }>(`${this.API_URL}/auth/verificar-nome`, {
        params: { nome },
      })
      .pipe(map((r) => r.disponivel));
  }

  terminarSessao(): void {
    this._token.set(null);
    this._utilizador.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.router.navigate(['/login']);
  }

  private restaurarSessao(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    if (token && user) {
      try {
        this._token.set(token);
        this._utilizador.set(JSON.parse(user));
      } catch {
        this.terminarSessao();
      }
    }
  }

  private guardarSessao(res: AuthResponse): void {
    this._token.set(res.token);
    this._utilizador.set(res.utilizador);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, res.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(res.utilizador));
    }
  }
}
