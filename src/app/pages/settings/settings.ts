import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  constructor(private router: Router) {}

  estaActiva(aba: string): boolean {
    return this.router.url === `/settings/${aba}` ||
           (aba === 'conta' && this.router.url === '/settings');
  }

  navegar(aba: string): void {
    this.router.navigate(['/settings', aba]);
  }
}
