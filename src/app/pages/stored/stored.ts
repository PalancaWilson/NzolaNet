import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCard } from '../../components/post-card/post-card';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-stored',
  imports: [CommonModule, PostCard],
  templateUrl: './stored.html',
  styleUrl: './stored.css',
})
export class Stored {
  postsGuardados = computed(() =>
    this.postService.publicacoes().filter(p => p.guardado)
  );

  constructor(readonly postService: PostService) {
    // Garantir que os posts estão carregados
    if (!this.postService.publicacoes().length) {
      this.postService.obterFeed().subscribe();
    }
  }
}
