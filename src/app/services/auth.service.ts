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
  private readonly USER_KEY  = 'nzolanet_user';

  private _token  = signal<string | null>(null);
  private _utilizador = signal<AuthResponse['utilizador'] | null>(null);

  readonly estaAutenticado  = computed(() => !!this._token());
  readonly utilizadorAtual = computed(() => this._utilizador());
  readonly token = computed(() => this._token());

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.restaurarSessao();
  }

  iniciarSessao(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, payload).pipe(
      tap(res => this.guardarSessao(res)),
      catchError(err => {
        console.error('Erro no login:', err);
        return throwError(() => new Error('Falha no login. Tente novamente.'));
      })
    );
  }

  registar(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/registar`, payload).pipe(
      tap(res => this.guardarSessao(res)),
      catchError(err => {
        const msg = err?.error?.mensagem ?? err?.message ?? 'Falha no registo. Tente novamente.';
        return throwError(() => new Error(msg));
      })
    );
  }

  verificarEmail(email: string): Observable<boolean> {
    return this.http
      .get<{ disponivel: boolean }>(`${this.API_URL}/auth/verificar-email`, {
        params: { email },
      })
      .pipe(map(r => r.disponivel));
  }

  verificarNome(nome: string): Observable<boolean> {
    return this.http
      .get<{ disponivel: boolean }>(`${this.API_URL}/auth/verificar-nome`, {
        params: { nome },
      })
      .pipe(map(r => r.disponivel));
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
    const user  = localStorage.getItem(this.USER_KEY);
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
