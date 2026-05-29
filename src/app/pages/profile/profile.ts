import { Component } from '@angular/core';
import { Sidebar} from '../../components/sidebar/sidebar';
import { Topbar } from '../../components/topbar/topbar';
import { PostCard } from '../../components/post-card/post-card';

@Component({
  selector: 'app-profile',
  imports: [Sidebar, Topbar, PostCard ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {}
