import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-aparencia',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './aparencia.html',
  styleUrl: './aparencia.css',
})
export class Aparencia {
  constructor(public settings: SettingsService) {}

  alternarModoEscuro(): void {
    this.settings.atualizarDefinicoes({ modoEscuro: !this.settings.modoEscuro() });
  }
}
