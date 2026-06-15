import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Topbar } from '../../components/topbar/topbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AppModal } from '../../components/modal/modal';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Topbar, Sidebar, AppModal],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShell implements OnInit {
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.contarDenunciasPendentes().subscribe();
  }
}
