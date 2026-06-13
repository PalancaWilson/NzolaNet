import { Component, signal, computed, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SearchUser, UtilizadorSugestao } from '../../components/search-user/search-user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Mensagem {
  id: string;
  texto: string;
  minha: boolean;
  tempo: string;
}
interface Conversa {
  id: string;
  nome: string;
  username: string;
  avatar: string;
  ultimaMensagem: string;
  tempo: string;
  naoLidas: number;
  mensagens: Mensagem[];
}

@Component({
  selector: 'app-mensagens',
  imports: [ReactiveFormsModule, RouterLink, SearchUser],
  templateUrl: './mensagens.html',
  styleUrl: './mensagens.css',
})
export class Mensagens implements OnInit {
  private readonly API_URL = environment.apiUrl;

  conversaActiva = signal<Conversa | null>(null);
  msgCtrl = new FormControl('');
  pesqCtrl = new FormControl('');
  showSearch = signal(false);
  conversas = signal<Conversa[]>([]);

  conversasFiltradas = computed(() => {
    const p = this.pesqCtrl.value?.toLowerCase() ?? '';
    return p
      ? this.conversas().filter(c => c.nome.toLowerCase().includes(p) || c.username.includes(p))
      : this.conversas();
  });

  constructor(
    readonly userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.carregarConversas();
    this.route.queryParams.subscribe(params => {
      const userId = params['user'];
      if (userId) {
        const existente = this.conversas().find(c => c.id === userId);
        if (existente) this.abrirConversa(existente);
      }
    });
  }

  private carregarConversas(): void {
    this.http.get<Conversa[]>(`${this.API_URL}/conversas`).subscribe(c => this.conversas.set(c));
  }

  abrirConversa(c: Conversa): void {
    this.conversas.update(lista =>
      lista.map(cv => cv.id === c.id ? { ...cv, naoLidas: 0 } : cv),
    );
    this.conversaActiva.set({ ...c, naoLidas: 0 });
  }

  enviar(): void {
    const texto = this.msgCtrl.value?.trim();
    if (!texto || !this.conversaActiva()) return;

    const nova: Mensagem = {
      id: 'm-' + Date.now(),
      texto,
      minha: true,
      tempo: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    };

    const idActivo = this.conversaActiva()!.id;
    this.http.post(`${this.API_URL}/conversas/${idActivo}/mensagens`, { texto }).subscribe(() => {
      this.conversas.update(lista =>
        lista.map(c => c.id === idActivo
          ? { ...c, mensagens: [...c.mensagens, nova], ultimaMensagem: texto, tempo: 'agora' }
          : c,
        ),
      );
      this.conversaActiva.update(c => c ? { ...c, mensagens: [...c.mensagens, nova] } : c);
    });
    this.msgCtrl.reset();
  }

  enviarEnter(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.enviar(); }
  }

  totalNaoLidas = computed(() => this.conversas().reduce((s, c) => s + c.naoLidas, 0));

  novaConversa(): void {
    this.showSearch.set(true);
  }

  onUserSelected(user: UtilizadorSugestao | null): void {
    this.showSearch.set(false);
    if (!user) return;
    this.http.post<{ id: string }>(`${this.API_URL}/conversas`, {
      outro_id: user.id,
    }).subscribe(res => {
      const novaConv: Conversa = {
        id: res.id,
        nome: user.nome,
        username: user.username,
        avatar: user.avatar,
        ultimaMensagem: '',
        tempo: '',
        naoLidas: 0,
        mensagens: [],
      };
      this.conversas.update(lista => [...lista, novaConv]);
      this.abrirConversa(novaConv);
    });
  }

  irParaPerfil(): void {
    if (this.conversaActiva()) {
      this.router.navigate(['/profile', this.conversaActiva()!.id]);
    }
  }
}
