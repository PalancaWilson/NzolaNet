import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-topbar',
  imports: [RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  menuAberto = signal(false);
  constructor(
     readonly userService: UserService,
     readonly auth: AuthService
  ) {}
alternarMenu(): void { this.menuAberto.update(v => !v); }
}
