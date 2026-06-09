export interface Post {
  id: string;
  author: {
    id: string;
    nome: string;
    username: string;
    avatar: string;
    badge?: 'creator' | 'verified' | 'premium';
  };
  content: string;
  image?: string;
  tags?: string[];
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  timeAgo: string;
  liked?: boolean;
  saved?: boolean;
}
