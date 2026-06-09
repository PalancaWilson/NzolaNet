export interface UserSettings {
  notificacaoBaze: boolean;
  notificacaoComentario: boolean;
  notificacaoSeguidor: boolean;
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
  modoEscuro: false,
  perfilPrivado: false,
  mostrarEmail: false,
  idioma: 'Português',
  regiao: 'Angola',
};