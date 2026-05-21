import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css']
})
export class PostCard {
  // Dados do post diretamente no componente
  post = {
    id: 1,
    authorName: 'Marco Aurélio',
    authorUsername: 'MARCO_DEV',
    isVerified: true,
    timestamp: 'Há 12 minutos',
    content: 'Acabei de chegar ao evento de tecnologia em Lisboa! A energia aqui está incrível. Alguém por aqui? 😍💚',
    imageUrl: '../../../assets/imagens/avatar-tiago.jpg', // Adicionando imagem
    likes: 421,
    comments: 24,
    liked: false
  };

  // Método para alternar like
  toggleLike(): void {
    this.post.liked = !this.post.liked;
    this.post.likes += this.post.liked ? 1 : -1;
  }

  // Método para comentar
  onComment(): void {
    console.log('Abrir modal de comentários');
    // Aqui você pode abrir um modal ou fazer outra ação
  }

  // Método para compartilhar
  onShare(): void {
    console.log('Abrir opções de compartilhamento');
    // Aqui você pode abrir um modal de compartilhamento
  }

  // Obter iniciais para o avatar
  getInitials(): string {
    if (!this.post.authorName) return '?';
    return this.post.authorName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}