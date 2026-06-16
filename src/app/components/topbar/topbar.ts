import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, FormsModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  query = signal('');

  constructor(
    readonly userService: UserService,
    readonly auth: AuthService,
    readonly layout: LayoutService,
    private router: Router,
  ) {}

  alternarMenu(): void {
    this.layout.alternarSidebar();
  }

  pesquisar(): void {
    const q = this.query().trim();
    if (q) {
      this.router.navigate(['/explorar'], { queryParams: { q } });
      this.query.set('');
    }
  }
}
