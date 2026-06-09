import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RegisterPayload } from '../models/auth.models';

// -------------------------------------------------------------------
// Estrutura de um utilizador guardado localmente.
// A senha é guardada em texto simples APENAS para desenvolvimento.
// Quando o backend Laravel estiver pronto, este serviço é eliminado —
// o servidor fará o hash com bcrypt antes de guardar na base de dados.
// -------------------------------------------------------------------
export interface UtilizadorLocal {
  id: string;
  nome: string;
  email: string;
  senha: string;          
  data_nascimento?: string;
  genero?: string;
  foto_perfil?: string;
  biografia?: string;
  privacidade?: 'publico' | 'privado';
  localizacao?: string;
  criadoEm: string;        
}

@Injectable({ providedIn: 'root' })
export class LocalStorageUserService {

  private readonly CHAVE = 'nzolanet_utilizadores';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  // -------------------------------------------------------------------
  // Obter todos os utilizadores registados
  // -------------------------------------------------------------------
  obterTodos(): UtilizadorLocal[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const dados = localStorage.getItem(this.CHAVE);
      return dados ? (JSON.parse(dados) as UtilizadorLocal[]) : [];
    } catch {
      return [];
    }
  }

  // -------------------------------------------------------------------
  // Registar um novo utilizador
  // Retorna o utilizador criado ou lança um erro se o email já existe
  // -------------------------------------------------------------------
  registar(payload: RegisterPayload): UtilizadorLocal {
    const lista = this.obterTodos();

    // Verificar email duplicado (equivale a UNIQUE no MySQL)
    const jaExiste = lista.some(
      u => u.email.toLowerCase() === payload.email.toLowerCase()
    );
    if (jaExiste) {
      throw new Error('Este email já está registado.');
    }

    const novoUtilizador: UtilizadorLocal = {
      id:             'local-' + Date.now(),
      nome:           payload.nome,
      email:          payload.email.toLowerCase().trim(),
      senha:          payload.senha,
      data_nascimento: payload.data_nascimento,
      genero:          payload.genero,
      foto_perfil:     payload.foto_perfil,
      biografia:       payload.biografia,
      privacidade:     payload.privacidade,
      criadoEm:       new Date().toISOString(),
    };

    lista.push(novoUtilizador);
    this.guardar(lista);

    return novoUtilizador;
  }

  // -------------------------------------------------------------------
  // Verificar credenciais de login
  // Retorna o utilizador ou null se não encontrar
  // -------------------------------------------------------------------
  verificarCredenciais(email: string, senha: string): UtilizadorLocal | null {
    const lista = this.obterTodos();
    return lista.find(
      u =>
        u.email.toLowerCase() === email.toLowerCase().trim() &&
        u.senha === senha
    ) ?? null;
  }

  // -------------------------------------------------------------------
  // Verificar se um email já está em uso (útil para validação em tempo real)
  // -------------------------------------------------------------------
   emailEmUso(email: string): boolean {
    return this.obterTodos().some(
      u => u.email.toLowerCase() === email.toLowerCase().trim()
    );
  }

  // -------------------------------------------------------------------
  // Apagar todos os utilizadores (útil para testes / reset)
  // -------------------------------------------------------------------
  limpar(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.CHAVE);
    }
  }

  // -------------------------------------------------------------------
  // Métodos privados
  // -------------------------------------------------------------------

  private guardar(lista: UtilizadorLocal[]): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.CHAVE, JSON.stringify(lista));
  }

 
}