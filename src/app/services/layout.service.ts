import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  sidebarAberto = signal(false);

  abrirSidebar():   void { this.sidebarAberto.set(true);  }
  fecharSidebar():  void { this.sidebarAberto.set(false); }
  alternarSidebar(): void { this.sidebarAberto.update(v => !v); }
}
