import { Injectable, signal, computed, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserSettings, DEFAULT_SETTINGS } from '../models/settings.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SettingsService {

  private readonly API_URL = environment.apiUrl;

  private _settings = signal<UserSettings>({ ...DEFAULT_SETTINGS });

  readonly definicoes          = computed(() => this._settings());
  readonly modoEscuro        = computed(() => this._settings().modoEscuro);
  readonly idioma            = computed(() => this._settings().idioma);
  readonly regiao            = computed(() => this._settings().regiao);
  readonly notificacaoBaze   = computed(() => this._settings().notificacaoBaze);
  readonly notificacaoComentario = computed(() => this._settings().notificacaoComentario);
  readonly notificacaoSeguidor   = computed(() => this._settings().notificacaoSeguidor);
  readonly notificacaoMencao     = computed(() => this._settings().notificacaoMencao);
  readonly perfilPrivado     = computed(() => this._settings().perfilPrivado);
  readonly mostrarEmail      = computed(() => this._settings().mostrarEmail);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.classList.toggle('dark-mode', this._settings().modoEscuro);
      }
    });
  }

  atualizarDefinicoes(parcial: Partial<UserSettings>): void {
    this._settings.update(atual => ({ ...atual, ...parcial }));
    this.sincronizarComBackend(this._settings());
  }

  private sincronizarComBackend(settings: UserSettings): void {
    this.http.put(`${this.API_URL}/settings`, settings).pipe(
      catchError(() => of(null)),
    ).subscribe();
  }

  carregarDoServidor(): Observable<UserSettings> {
    return this.http.get<UserSettings>(`${this.API_URL}/settings`).pipe(
      tap(s => this._settings.set(s)),
      catchError(() => of(this._settings())),
    );
  }
}
