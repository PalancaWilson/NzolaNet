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
  selector: 'app-idiomas',
  imports: [FormsModule, Sidebar, Topbar],
  templateUrl: './idiomas.html',
  styleUrl: './idiomas.css',
})
export class Idiomas {

  abaSelecionada: AbaDefinicao = 'idioma';
  
notificacaoBaze = true
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
