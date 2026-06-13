export type NotificationType = 'baze' | 'follow' | 'comment' | 'mention';

export interface Notifications {
  id: string;
  type: NotificationType;
  utilizador: {
    nome: string;
    nomeUtilizador: string;
    avatar: string;
    emblema?: 'creator' | 'verified' | 'premium';
  };
  mensagem: string;
  tempoDecorrido: string;
  lida: boolean;
  tituloPublicacao?: string;
}
