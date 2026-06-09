import { Component, OnInit } from '@angular/core';

import { Sidebar } from '../../components/sidebar/sidebar';
import { Topbar } from '../../components/topbar/topbar';
import { CreatePost } from '../../components/create-post/create-post';
import { PostCard } from '../../components/post-card/post-card';
import { RightSidebar } from "../../components/right-sidebar/right-sidebar";
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-feed',
  imports: [Sidebar, Topbar, CreatePost, PostCard, RightSidebar],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed  implements OnInit{
   // Expõe o postService ao template para ler o signal reativo diretamente
  constructor(readonly postService: PostService) {}

  ngOnInit(): void {
    // Carrega os posts; o signal postService.posts() atualiza o template automaticamente
    this.postService.getFeed().subscribe();
  }
}
