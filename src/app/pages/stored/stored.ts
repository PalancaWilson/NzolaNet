import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Topbar } from '../../components/topbar/topbar';
import { PostCard } from '../../components/post-card/post-card';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-stored',
  imports: [CommonModule, Sidebar, Topbar, PostCard],
  templateUrl: './stored.html',
  styleUrl: './stored.css',
})
export class Stored {
  postsGuardados = computed(() =>
    this.postService.posts().filter(p => p.saved)
  );

  constructor(readonly postService: PostService) {
    // Garantir que os posts estão carregados
    if (!this.postService.posts().length) {
      this.postService.getFeed().subscribe();
    }
  }
}
