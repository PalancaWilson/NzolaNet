import { Component, OnInit, signal, computed } from '@angular/core';
import { Notifications, NotificationType } from '../../models/notifications.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

type Filtro = 'todas' | NotificationType;

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css']
})
export class Notification implements OnInit {
  private readonly API_URL = environment.apiUrl;

  private _notificacoes = signal<Notifications[]>([]);
  filtroActivo          = signal<Filtro>('todas');

  notificacoesFiltradas = computed(() => {
    const f = this.filtroActivo();
    return f === 'todas'
      ? this._notificacoes()
      : this._notificacoes().filter(n => n.type === f);
  });

  naoLidas = computed(() =>
    this._notificacoes().filter(n => !n.lida).length
  );

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Notifications[]>(`${this.API_URL}/notificacoes`).subscribe(n => {
      this._notificacoes.set(n ?? []);
    });
  }

  setFiltro(f: Filtro): void { this.filtroActivo.set(f); }

  marcarLida(id: string): void {
    this.http.put(`${this.API_URL}/notificacoes/${id}/ler`, {}).subscribe(() => {
      this._notificacoes.update(lista =>
        lista.map(n => n.id === id ? { ...n, lida: true } : n),
      );
    });
  }

  marcarTodasLidas(): void {
    // TODO: endpoint para marcar todas como lidas
    this._notificacoes.update(lista => lista.map(n => ({ ...n, lida: true })));
  }

  getIcone(tipo: string): string {
    const mapa: Record<string, string> = {
      baze:    'bi bi-heart-fill',
      comment: 'bi bi-chat-fill',
      follow:  'bi bi-person-plus-fill',
      mention: 'bi bi-at',
    };
    return mapa[tipo] ?? 'bi bi-bell-fill';
  }

  getCor(tipo: string): string {
    const mapa: Record<string, string> = {
      baze:    '#f91880',
      comment: '#1da1f2',
      follow:  '#00ba7c',
      mention: '#c92df1',
    };
    return mapa[tipo] ?? '#71767b';
  }
}
