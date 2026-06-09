import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Topbar } from '../../components/topbar/topbar';

type AbaDefinicao =
  | 'conta'
  | 'notificacoes'
  | 'privado'
  | 'aparencia'
  | 'idioma';
@Component({
  selector: 'app-settings',
  standalone: true,

  imports: [

    RouterOutlet,
    Sidebar,
    Topbar,
    FormsModule
  ],

  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {

   abaSelecionada: AbaDefinicao = 'conta';

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

