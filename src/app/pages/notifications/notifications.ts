import { Component, OnInit, signal, computed } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { Topbar } from "../../components/topbar/topbar";
import { Notifications, NotificationType } from '../../models/notifications.model';
import { MockDataService } from '../../services/mock-data.service';

type Filtro = 'todas' | NotificationType;

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [Sidebar, Topbar],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css']
})
export class Notification  implements OnInit{

  private _notificacoes = signal<Notifications[]>([]);
  filtroActivo          = signal<Filtro>('todas');

  // Computed — refiltra automaticamente quando filtro ou lista muda
  notificacoesFiltradas = computed(() => {
    const f = this.filtroActivo();
    return f === 'todas'
      ? this._notificacoes()
      : this._notificacoes().filter(n => n.type === f);
  });

  naoLidas = computed(() =>
    this._notificacoes().filter(n => !n.read).length
  );

  constructor(private mock: MockDataService) {}

  ngOnInit(): void {
    this._notificacoes.set(this.mock.getNotifications());
  }

  setFiltro(f: Filtro): void { this.filtroActivo.set(f); }

  marcarLida(id: string): void {
    this._notificacoes.update(lista =>
      lista.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  marcarTodasLidas(): void {
    this._notificacoes.update(lista => lista.map(n => ({ ...n, read: true })));
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
