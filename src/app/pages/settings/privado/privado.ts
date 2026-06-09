import { Component } from '@angular/core';



type AbaDefinicao =
  | 'conta'
  | 'notificacoes'
  | 'privado'
  | 'aparencia'
  | 'idioma';

@Component({
  selector: 'app-privado',
  imports: [  ],
  templateUrl: './privado.html',
  styleUrl: './privado.css',
})
export class Privado {

   abaSelecionada: AbaDefinicao = 'privado';

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
