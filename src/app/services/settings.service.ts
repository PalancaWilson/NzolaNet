import { Injectable, signal, computed, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserSettings, DEFAULT_SETTINGS } from '../models/settings.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {

  private readonly API_URL      = 'https://api.nzolanet.app/api';
  private readonly STORAGE_KEY  = 'nzolanet_settings';

  // ---------------------------------------------------------------------------
  // Estado reativo — Signal como fonte única de verdade
  // ---------------------------------------------------------------------------
  private _settings = signal<UserSettings>({ ...DEFAULT_SETTINGS });

  // Computed — leituras individuais para os templates
  readonly settings          = computed(() => this._settings());
  readonly modoEscuro        = computed(() => this._settings().modoEscuro);
  readonly idioma            = computed(() => this._settings().idioma);
  readonly regiao            = computed(() => this._settings().regiao);
  readonly notificacaoBaze   = computed(() => this._settings().notificacaoBaze);
  readonly notificacaoComentario = computed(() => this._settings().notificacaoComentario);
  readonly notificacaoSeguidor   = computed(() => this._settings().notificacaoSeguidor);
  readonly perfilPrivado     = computed(() => this._settings().perfilPrivado);
  readonly mostrarEmail      = computed(() => this._settings().mostrarEmail);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.carregarDefinicoes();

    // Aplicar tema escuro automaticamente quando a definição muda
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.classList.toggle('dark-mode', this._settings().modoEscuro);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Atualizar uma ou mais definições
  // ---------------------------------------------------------------------------
  atualizar(parcial: Partial<UserSettings>): void {
    this._settings.update(atual => ({ ...atual, ...parcial }));
    this.persistir();
    this.sincronizarComBackend(this._settings());
  }

  // ---------------------------------------------------------------------------
  // Persistência local (backup offline)
  // ---------------------------------------------------------------------------
  private persistir(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._settings()));
  }

  private carregarDefinicoes(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const guardado = localStorage.getItem(this.STORAGE_KEY);
    if (guardado) {
      try {
        const parsed = JSON.parse(guardado) as Partial<UserSettings>;
        this._settings.update(atual => ({ ...atual, ...parsed }));
      } catch {
        // dados corrompidos — usar padrão
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Sincronização com backend (silenciosa — não bloqueia a UI)
  // TODO: ativar quando o backend estiver pronto
  // ---------------------------------------------------------------------------
  private sincronizarComBackend(settings: UserSettings): void {
    // this.http.put(`${this.API_URL}/settings`, settings).pipe(
    //   catchError(() => of(null))
    // ).subscribe();
  }

  // ---------------------------------------------------------------------------
  // Carregar definições do servidor (chamar no login)
  // ---------------------------------------------------------------------------
  carregarDoServidor(): Observable<UserSettings> {
    // TODO: descomentar quando o backend estiver pronto
    // return this.http.get<UserSettings>(`${this.API_URL}/settings`).pipe(
    //   tap(s => this._settings.set(s)),
    //   catchError(() => of(this._settings()))
    // );
    return of(this._settings()); // mock temporário
  }
}