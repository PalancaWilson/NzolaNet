import { Component, Input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
 @Input() aberto = false;
constructor(
    readonly userService: UserService,
    private auth: AuthService,
    readonly layout: LayoutService
  ) {}

 navegar(): void {
    // fecha sidebar no mobile quando clica num link
    this.layout.fecharSidebar();
  }

  logout(): void {
    if (confirm('Tens a certeza que queres terminar a sessão?')) {
      this.userService.limpar();
      this.auth.terminarSessao();
    }
  }

}