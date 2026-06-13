import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-privado',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './privado.html',
  styleUrl: './privado.css',
})
export class Privado {
  constructor(public settings: SettingsService) {}

  atualizar(chave: 'perfilPrivado' | 'mostrarEmail', valor: boolean): void {
    this.settings.atualizarDefinicoes({ [chave]: valor });
  }
}
