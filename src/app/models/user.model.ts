export interface User {
  id: string;
  nome: string;
  nomeUtilizador: string;
  avatar: string;
  biografia?: string;
  seguidores: number;
  seguindo: number;
  bazes: number;
  estaSeguindo?: boolean;
  emblema?: 'creator' | 'verified' | 'premium';
}
