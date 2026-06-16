import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-idiomas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './idiomas.html',
  styleUrl: './idiomas.css',
})
export class Idiomas {
  constructor(public settings: SettingsService) {}

  atualizar(chave: 'idioma' | 'regiao', valor: string): void {
    this.settings.atualizarDefinicoes({ [chave]: valor });
  }
}
