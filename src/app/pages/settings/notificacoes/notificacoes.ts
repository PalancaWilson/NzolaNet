import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Topbar } from '../../../components/topbar/topbar';

type AbaDefinicao =
  | 'conta'
  | 'notificacoes'
  | 'privado'
  | 'aparencia'
  | 'idioma';

@Component({
  selector: 'app-notificacoes',
  imports: [Sidebar, Topbar, FormsModule ],
  templateUrl: './notificacoes.html',
  styleUrl: './notificacoes.css',
})
export class Notificacoes {
    abaSelecionada: AbaDefinicao = 'notificacoes';

  notificacaoBaze = true;
  notificacaoComentario = true;
  notificacaoSeguidor = false;

  modoEscuro = false;

  perfilPrivado = false;
  mostrarEmail = false;

  idioma = 'Português';
  regiao = 'Angola';

  selecionarAba(aba: AbaDefinicao): void {
    this.abaSelecionada = aba;
  }

  
}
