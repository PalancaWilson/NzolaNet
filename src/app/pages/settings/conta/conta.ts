import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';


type AbaDefinicao =
  | 'conta'
  | 'notificacoes'
  | 'privado'
  | 'aparencia'
  | 'idioma';

@Component({
  selector: 'app-conta',
  imports: [FormsModule],
  templateUrl: './conta.html',
  styleUrl: './conta.css',
})
export class Conta {

  abaSelecionada: AbaDefinicao = 'conta';
  
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
