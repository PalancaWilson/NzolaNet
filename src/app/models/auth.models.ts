export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  data_nascimento?: string;
  genero?: string;
  foto_perfil?: string;
  biografia?: string;
  privacidade?: 'publico' | 'privado';
}

export interface AuthResponse {
  token: string;
  utilizador: {
    id: string;
    nome: string;
    email: string;
    foto_perfil: string | undefined;
    foto_capa?: string;
    data_nascimento?: string;
    biografia?: string;
    privacidade?: 'publico' | 'privado';
    admin?: boolean;
  };
}
