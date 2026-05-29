import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',

  standalone: true,

  imports: [
    RouterLink,RouterLinkActive, CommonModule
  ],

  templateUrl: './sidebar.html',

  styleUrl: './sidebar.css',
})
export class Sidebar {

  constructor(
    private router: Router
  ) {}

  logout(): void {

    const confirmLogout = confirm(
      'Tem certeza de que deseja terminar a sessão?'
    );

    if(confirmLogout){

      localStorage.clear();

      this.router.navigate(['/login']);

    }

  }

}