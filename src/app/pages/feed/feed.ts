import { Component } from '@angular/core';

import { Sidebar } from '../../components/sidebar/sidebar';
import { Topbar } from '../../components/topbar/topbar';
import { CreatePost } from '../../components/create-post/create-post';
import { PostCard } from '../../components/post-card/post-card';
import { RightSidebar } from "../../components/right-sidebar/right-sidebar";


@Component({
  selector: 'app-feed',
  imports: [Sidebar, Topbar, CreatePost, PostCard, RightSidebar],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed {}
