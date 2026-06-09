import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css']
})
export class PostCard {
  @Input({ required: true }) post!: Post;

  constructor(private postService: PostService) {}

  getInitials(): string {
    if (!this.post?.author?.nome) return '?';
    return this.post.author.nome
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  toggleLike(): void {
    this.postService.toggleBaze(this.post.id).subscribe();
  }

  toggleGuardar(): void {
    this.postService.toggleGuardar(this.post.id).subscribe();
  }

  onComment(): void {
    // TODO: abrir modal de comentários quando o backend estiver pronto
    console.log('Comentar post:', this.post.id);
  }

  onShare(): void {
    if (navigator.share) {
      navigator.share({ title: this.post.author.nome, text: this.post.content });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }
}