import { Component } from '@angular/core';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Topbar } from '../../../components/topbar/topbar';
import { FormsModule } from '@angular/forms';

type AbaDefinicao =
  | 'conta'
  | 'notificacoes'
  | 'privado'
  | 'aparencia'
  | 'idioma';

@Component({
  selector: 'app-aparencia',
  imports: [FormsModule,Sidebar, Topbar],
  templateUrl: './aparencia.html',
  styleUrl: './aparencia.css',
})
export class Aparencia {

  abaSelecionada: AbaDefinicao = 'aparencia';

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
