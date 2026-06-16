import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './notificacoes.html',
  styleUrl: './notificacoes.css',
})
export class Notificacoes {
  constructor(public settings: SettingsService) {}

  atualizar(chave: 'notificacaoBaze' | 'notificacaoComentario' | 'notificacaoSeguidor' | 'notificacaoMencao', valor: boolean): void {
    this.settings.atualizarDefinicoes({ [chave]: valor });
  }
}
