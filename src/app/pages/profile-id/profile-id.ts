import { Component } from '@angular/core';
import { Sidebar} from '../../components/sidebar/sidebar';
import { Topbar } from '../../components/topbar/topbar';
import { PostCard } from '../../components/post-card/post-card';


@Component({
  selector: 'app-profile-id',
  imports: [Sidebar, Topbar, PostCard],
  templateUrl: './profile-id.html',
  styleUrl: './profile-id.css',
})
export class ProfileId {}
