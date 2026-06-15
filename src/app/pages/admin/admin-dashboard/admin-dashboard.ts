import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService, AdminStats } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  constructor(readonly adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.obterEstatisticas().subscribe();
  }

  get stats(): AdminStats | null {
    return this.adminService.estatisticas();
  }
}
