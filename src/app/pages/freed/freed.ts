import { Component } from '@angular/core';

import { Sidebar } from '../../components/sidebar/sidebar';
import { Topbar } from '../../components/topbar/topbar';
import { CreatePost } from '../../components/create-post/create-post';
import { PostCard } from '../../components/post-card/post-card';

@Component({
  selector: 'app-freed',
  imports: [Sidebar, Topbar, CreatePost, PostCard],
  templateUrl: './freed.html',
  styleUrl: './freed.css',
})
export class Freed {}
