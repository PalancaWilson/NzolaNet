import { Injectable, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, delay, map } from 'rxjs/operators';
import { LoginPayload, RegisterPayload, AuthResponse } from '../models/auth.models';
import { LocalStorageUserService } from './storage_user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // ---------------------------------------------------------------------------
  // Configuração "Depois mudar para o backend" — URLs, chaves, etc.
  // ---------------------------------------------------------------------------
  private readonly API_URL = 'https://api.nzolanet.app/api';
  private readonly TOKEN_KEY = 'nzolanet_token';
  private readonly USER_KEY  = 'nzolanet_user';
  private readonly USERS_KEY = 'nzolanet_users';

  // ---------------------------------------------------------------------------
  // Estado reativo com Signals
  // ---------------------------------------------------------------------------
  private _token  = signal<string | null>(null);
  private _user   = signal<AuthResponse['user'] | null>(null);

  readonly isLoggedIn  = computed(() => !!this._token());
  readonly currentUser = computed(() => this._user());
  readonly token       = computed(() => this._token());

  constructor(
    private http: HttpClient,
    private router: Router,
    private localUsers: LocalStorageUserService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.restoreSession();
    this.inicializarUsuariosTeste();
  }

  // ---------------------------------------------------------------------------
  // Inicializar utilizadores de teste
  // ---------------------------------------------------------------------------
  private inicializarUsuariosTeste(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const existingUsers = localStorage.getItem(this.USERS_KEY);
    if (!existingUsers) {
      const usuariosTeste = [
        {
          id: '1',
          email: 'joao@email.com',
          senha: '123456',
          name: 'João Mendes',
          username: 'joao.mendes',
          avatar: 'https://i.pravatar.cc/150?img=1'
        },
        {
          id: '2',
          email: 'maria@email.com',
          senha: '123456',
          name: 'Maria Silva',
          username: 'maria.silva',
          avatar: 'https://i.pravatar.cc/150?img=2'
        },
        {
          id: '3',
          email: 'admin@nzolanet.app',
          senha: 'Admin123',
          name: 'Administrador',
          username: 'admin',
          avatar: 'https://i.pravatar.cc/150?img=3'
        },
        {
          id: '4',
          email: 'teste@nzolanet.app',
          senha: 'Teste123',
          name: 'Utilizador Teste',
          username: 'teste',
          avatar: 'https://i.pravatar.cc/150?img=4'
        },
        {
          id: '5',
          email: 'user@teste.com',
          senha: '123456',
          name: 'User Teste',
          username: 'user.teste',
          avatar: 'https://i.pravatar.cc/150?img=5'
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(usuariosTeste));
      console.log(' Utilizadores de teste inicializados:', usuariosTeste.length);
    }
  }

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------
  login(payload: LoginPayload): Observable<AuthResponse> {
    if(!this.backendDisponivel()) {
      console.warn('Backend não disponível, usando mock de login');
      return this.mockLogin(payload);
    }
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, payload).pipe(
      tap(res => this.guardarSessao(res)),
      catchError(err => {
        console.error('Erro no login:', err);
        return throwError(() => new Error('Falha no login, Tente novamente.'));
      })
    );
  }

  // ---------------------------------------------------------------------------
  // Registo
  // ---------------------------------------------------------------------------
  register(payload: RegisterPayload): Observable<AuthResponse> {
    if(!this.backendDisponivel()) {
    return this.mockRegister(payload);
  }
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, payload).pipe(
      tap(res => this.guardarSessao(res)),
      catchError(err => throwError(() => new Error('Falha no registo. Tente novamente.')))
    );
  }

// ---------------------------------------------------------------------------
// Simular disponibilidade do backend
// ---------------------------------------------------------------------------
  backendDisponivel(): boolean {
    // Simular indisponibilidade do backend (pode ser controlado por uma variável de ambiente ou configuração)
    return false; // Definir como false para usar os mocks
  }


  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------
  logout(): void {
    this._token.set(null);
    this._user.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.router.navigate(['/login']);
    console.log(' Logout realizado');
  }

  // ---------------------------------------------------------------------------
  // Restaurar sessão
  // ---------------------------------------------------------------------------
  private restoreSession(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem(this.TOKEN_KEY);
    const user  = localStorage.getItem(this.USER_KEY);

    if (token && user) {
      try {
        this._token.set(token);
        this._user.set(JSON.parse(user));
        console.log(' Sessão restaurada para:', JSON.parse(user).nome);
      } catch {
        this.logout();
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Guardar sessão
  // ---------------------------------------------------------------------------
  private guardarSessao(res: AuthResponse): void {
    if (res.token && res.user) {
      this._token.set(res.token);
      this._user.set(res.user);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
      }
      console.log(' Sessão guardada para:', res.user.nome);
    }
  }

  // ---------------------------------------------------------------------------
  // Mock de Login (CORRIGIDO - sem of(null))
  // ---------------------------------------------------------------------------
  private mockLogin(payload: LoginPayload): Observable<AuthResponse> {
    // Criar um Observable que retorna diretamente o resultado
    return new Observable<AuthResponse>((subscriber) => {
      // Simular delay de rede
      setTimeout(() => {
        if (!isPlatformBrowser(this.platformId)) {
          subscriber.error({ message: 'Não está no browser' });
          subscriber.complete();
          return;
        }
        
        // Buscar utilizadores do localStorage
        const usersStr = localStorage.getItem(this.USERS_KEY);
        if (!usersStr) {
          subscriber.error({ message: 'Nenhum utilizador encontrado' });
          subscriber.complete();
          return;
        }
        
        const users = JSON.parse(usersStr);
        console.log(' Utilizadores disponíveis:', users.map((u: any) => u.email));
        
        // Procurar utilizador pelo email
        const user = users.find((u: any) => u.email === payload.email);
        
        // Verificar credenciais
        if (user && user.senha === payload.senha) {
          const response: AuthResponse = {
            token: 'mock-jwt-token-' + Date.now() + '-' + user.id,
            user: {
              id: user.id,
              nome: user.nome,
              email: user.email,             
              foto_perfil: user.foto_perfil,
            }
          };
          this.guardarSessao(response);
          console.log(' Login bem-sucedido:', user.nome);
          subscriber.next(response);
          subscriber.complete();
        } else {
          console.log(' Login falhou - Credenciais inválidas para:', payload.email);
          subscriber.error({ message: 'Email ou palavra-passe incorretos.' });
          subscriber.complete();
        }
      }, 1000);
    });
  }

  // ---------------------------------------------------------------------------
  // Mock de Registo (CORRIGIDO - sem of(null))
  // ---------------------------------------------------------------------------
 private mockRegister(payload: RegisterPayload): Observable<AuthResponse> {
    try {
      const criado = this.localUsers.registar(payload);
      const res: AuthResponse = {
        token: 'local-jwt-' + Date.now(),
        user: { id: criado.id, nome: criado.nome, email: criado.email,
                foto_perfil: criado.foto_perfil, biografia: criado.biografia, privacidade: criado.privacidade },
      };
      this.guardarSessao(res);
      return of(res);
    } catch (err: any) {
      return throwError(() => ({ message: err.message ?? 'Erro ao criar conta.' }));
    }
  }

  // ---------------------------------------------------------------------------
  // Utilitários
  // ---------------------------------------------------------------------------
  
  getUsuariosTeste(): any[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  adicionarUtilizadorTeste(email: string, senha: string, name: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const usersStr = localStorage.getItem(this.USERS_KEY);
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const newUser = {
      id: Date.now().toString(),
      email: email,
      senha: senha,
      nome: name,
      username: email.split('@')[0],
      foto_perfil: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 100)}`
    };
    
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    console.log(' Utilizador adicionado:', newUser);
  }

  limparDados(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.USERS_KEY);
    console.log(' Todos os dados limpos');
    this.inicializarUsuariosTeste();
  }
}