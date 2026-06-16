export interface UserSettings {
  notificacaoBaze: boolean;
  notificacaoComentario: boolean;
  notificacaoSeguidor: boolean;
  notificacaoMencao: boolean;
  modoEscuro: boolean;
  perfilPrivado: boolean;
  mostrarEmail: boolean;
  idioma: string;
  regiao: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  notificacaoBaze: true,
  notificacaoComentario: true,
  notificacaoSeguidor: false,
  notificacaoMencao: true,
  modoEscuro: false,
  perfilPrivado: false,
  mostrarEmail: false,
  idioma: 'Português',
  regiao: 'Angola',
};