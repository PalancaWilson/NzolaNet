import { Component, signal, computed, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface UtilizadorSugestao {
  id: string;
  nome: string;
  username: string;
  avatar: string;
}

@Component({
  selector: 'app-search-user',
  imports: [FormsModule],
  templateUrl: './search-user.html',
  styleUrl: './search-user.css',
})
export class SearchUser {
  private readonly API_URL = environment.apiUrl;

  termo = signal('');
  aberto = signal(true);
  selected = output<UtilizadorSugestao | null>();
  usuarios = signal<UtilizadorSugestao[]>([]);

  constructor(private http: HttpClient) {}

  resultados = computed(() => {
    const t = this.termo().toLowerCase().trim();
    if (t) {
      this.http.get<UtilizadorSugestao[]>(`${this.API_URL}/utilizadores?q=${encodeURIComponent(t)}`)
        .subscribe(u => this.usuarios.set(u));
    }
    return this.usuarios();
  });

  selecionar(u: UtilizadorSugestao): void {
    this.selected.emit(u);
    this.fechar();
  }

  fechar(): void {
    this.selected.emit(null);
  }
}
