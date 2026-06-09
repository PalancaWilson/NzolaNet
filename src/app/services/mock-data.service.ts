import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Notifications } from '../models/notifications.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  getPosts(): Post[] {
    return [
      {
        id: '1',
        author: { id: 'u1', nome: 'Ana Clara', username: 'ana_arte', avatar: 'https://i.pravatar.cc/150?img=47', badge: 'creator' },
        content: 'Nova paleta de cores para o projeto de identidade visual 🎨 Adoro como estas cores se complementam — quente e fria ao mesmo tempo.',
        image: 'https://picsum.photos/seed/palette/600/400',
        tags: ['design', 'cores', 'identidade'],
        likes: 142, comments: 18, shares: 9, saves: 34,
        timeAgo: 'há 2 horas', liked: false, saved: false
      },
      {
        id: '2',
        author: { id: 'u2', nome: 'Tiago Silva', username: 'tiago_tech', avatar: 'https://i.pravatar.cc/150?img=12', badge: 'verified' },
        content: 'Primeiro dia na Baze e já estou impressionado com a qualidade das publicações aqui. É exatamente a comunidade criativa que eu procurava! 🙌',
        tags: ['baze', 'comunidade', 'criatividade'],
        likes: 87, comments: 24, shares: 5, saves: 12,
        timeAgo: 'há 4 horas', liked: true, saved: false
      },
      {
        id: '3',
        author: { id: 'u3', nome: 'Beatriz Lima', username: 'be_trips', avatar: 'https://i.pravatar.cc/150?img=32', badge: 'creator' },
        content: 'Capturado este momento em Lisboa ao pôr do sol. A luz batia de forma tão especial que parecia pintado. 📸',
        image: 'https://picsum.photos/seed/lisbon/600/400',
        tags: ['fotografia', 'lisboa', 'pordosol'],
        likes: 321, comments: 41, shares: 28, saves: 76,
        timeAgo: 'há 6 horas', liked: false, saved: true
      },
      {
        id: '4',
        author: { id: 'u4', nome: 'Marco Aurélio', username: 'marco_dev', avatar: 'https://i.pravatar.cc/150?img=53', badge: 'verified' },
        content: 'Acabei de publicar um artigo sobre tipografia responsiva. Tantos projetos ainda ignoram como o texto se comporta em diferentes ecrãs. Vale a leitura!',
        tags: ['tipografia', 'webdesign', 'ux'],
        likes: 56, comments: 8, shares: 19, saves: 31,
        timeAgo: 'há 8 horas', liked: false, saved: false
      }
    ];
  }

  getNotifications(): Notifications[] {
    return [
      {
        id: 'n1', type: 'baze',
        user: { name: 'Marco Aurélio', username: 'marco_dev', avatar: 'https://i.pravatar.cc/150?img=53', badge: 'creator' },
        message: 'deu baze à tua publicação', postTitle: '"Primeiro dia na Baze..."',
        timeAgo: 'há 2 minutos', read: false
      },
      {
        id: 'n2', type: 'follow',
        user: { name: 'Ana Clara', username: 'ana_arte', avatar: 'https://i.pravatar.cc/150?img=47', badge: 'creator' },
        message: 'começou a seguir-te',
        timeAgo: 'há 18 minutos', read: false
      },
      {
        id: 'n3', type: 'comment',
        user: { name: 'Beatriz Lima', username: 'be_trips', avatar: 'https://i.pravatar.cc/150?img=32' },
        message: 'comentou: "Adoro a tua paleta, partilha mais!"',
        timeAgo: 'há 1 hora', read: false
      },
      {
        id: 'n4', type: 'baze',
        user: { name: 'Tiago Silva', username: 'tiago_tech', avatar: 'https://i.pravatar.cc/150?img=12', badge: 'verified' },
        message: 'e mais 12 deram baze ao teu vídeo.',
        timeAgo: 'há 4 horas', read: true
      },
      {
        id: 'n5', type: 'follow',
        user: { name: 'Marco Aurélio', username: 'marco_dev', avatar: 'https://i.pravatar.cc/150?img=53' },
        message: 'começou a seguir-te.',
        timeAgo: 'ontem', read: true
      },
      {
        id: 'n6', type: 'mention',
        user: { name: 'Carla Mendes', username: 'carla_m', avatar: 'https://i.pravatar.cc/150?img=25' },
        message: 'mencionou-te num comentário.',
        timeAgo: 'ontem', read: true
      }
    ];
  }

  getSuggestedUsers(): User[] {
    return [
      { id: 'su1', name: 'Rita Santos', username: 'rita_design', avatar: 'https://i.pravatar.cc/150?img=44', bio: 'UI/UX Designer • Porto', followers: 1420, following: 310, bazes: 89, isFollowing: false },
      { id: 'su2', name: 'João Ferreira', username: 'joao_foto', avatar: 'https://i.pravatar.cc/150?img=15', bio: 'Fotógrafo • Lisboa', followers: 3800, following: 220, bazes: 204, isFollowing: false },
      { id: 'su3', name: 'Sofia Cruz', username: 'sofia_arch', avatar: 'https://i.pravatar.cc/150?img=41', bio: 'Arquiteta & Ilustradora', followers: 980, following: 415, bazes: 67, isFollowing: false }
    ];
  }

  getSavedPosts(): Post[] {
    return this.getPosts().filter(p => p.saved);
  }

  getCurrentUser(): User {
    return {
      id: 'me',
      name: 'Tu',
      username: 'eu_user',
      avatar: 'https://i.pravatar.cc/150?img=60',
      bio: 'Criativo • Designer • Curioso 🌍',
      followers: 512,
      following: 198,
      bazes: 43
    };
  }
}
