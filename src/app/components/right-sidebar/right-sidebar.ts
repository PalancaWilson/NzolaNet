import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './right-sidebar.html',
  styleUrl: './right-sidebar.css',
})
export class RightSidebar implements OnInit {
  private readonly API_URL = environment.apiUrl;
  seguindoMap = signal<Record<string, boolean>>({});
  suggestions: { id: string; nome: string; subtitle: string; avatar: string }[] = [];
  notifications: { id: string; type: string; nome: string; texto: string; tempo: string }[] = [];

  constructor(
    readonly userService: UserService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${this.API_URL}/utilizadores`).subscribe(users => {
      this.suggestions = (users ?? []).map(u => ({
        id: u.id,
        nome: u.nome,
        subtitle: u.biografia ? `Seguidores: ${u.seguidores}` : 'Novo na Baze',
        avatar: u.foto_perfil || 'https://i.pravatar.cc/150?img=' + (Math.floor(Math.random() * 70) + 1),
      }));
    });
    this.http.get<any[]>(`${this.API_URL}/notificacoes`).subscribe(notifs => {
      this.notifications = (notifs ?? []).map(n => ({
        id: n.id,
        type: n.type,
        nome: n.autor?.nome ?? '',
        texto: n.mensagem ?? '',
        tempo: (n.tempoDecorrido ?? '').toUpperCase(),
      }));
    });
    const meuId = this.userService.perfil()?.id;
    if (meuId) {
      this.http.get<any[]>(`${this.API_URL}/utilizadores/${meuId}/seguindo`).subscribe(lista => {
        const map: Record<string, boolean> = {};
        (lista ?? []).forEach((u: any) => { if (u.id) map[u.id] = true; });
        this.seguindoMap.set(map);
      });
    }
  }

  toggleSeguir(id: string): void {
    const seguindo = this.seguindoMap()[id];
    const req$ = seguindo
      ? this.http.delete(`${this.API_URL}/utilizadores/${id}/deixar-de-seguir`)
      : this.http.post(`${this.API_URL}/utilizadores/${id}/seguir`, {});
    req$.subscribe(() => this.seguindoMap.update(m => ({ ...m, [id]: !m[id] })));
  }
  estaSeguindo(id: string): boolean { return !!this.seguindoMap()[id]; }

  getIcone(tipo: string): string {
    return ({ baze:'bi bi-heart-fill', follow:'bi bi-person-plus-fill', comment:'bi bi-chat-fill' } as any)[tipo] ?? 'bi bi-bell-fill';
  }
}
