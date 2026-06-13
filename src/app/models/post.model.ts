export interface Post {
  id: string;
  autor: {
    id: string;
    nome: string;
    nomeUtilizador: string;
    avatar: string;
    emblema?: 'creator' | 'verified' | 'premium';
  };
  conteudo: string;
  imagem?: string;
  etiquetas?: string[];
  gostos: number;
  comentarios: number;
  partilhas: number;
  guardados: number;
  tempoDecorrido: string;
  gostou?: boolean;
  guardado?: boolean;
}
