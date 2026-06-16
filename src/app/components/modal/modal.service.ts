import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ModalConfig {
  titulo: string;
  mensagem: string;
  modo: 'confirm' | 'prompt' | 'alert';
  valorInicial?: string;
  placeholder?: string;
  botoes?: { confirmar?: string; cancelar?: string };
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  aberto = signal(false);
  config = signal<ModalConfig | null>(null);

  private subject: Subject<any> | null = null;

  confirmar(
    titulo: string,
    mensagem: string,
    botoes?: { confirmar?: string; cancelar?: string },
  ): Observable<boolean> {
    this.config.set({ titulo, mensagem, modo: 'confirm', botoes });
    this.aberto.set(true);
    const sub = new Subject<boolean>();
    this.subject = sub;
    return sub.asObservable();
  }

  prompt(
    titulo: string,
    mensagem: string,
    valorInicial?: string,
    placeholder?: string,
  ): Observable<string | null> {
    this.config.set({ titulo, mensagem, modo: 'prompt', valorInicial, placeholder });
    this.aberto.set(true);
    const sub = new Subject<string | null>();
    this.subject = sub;
    return sub.asObservable();
  }

  alertar(titulo: string, mensagem: string): Observable<void> {
    this.config.set({ titulo, mensagem, modo: 'alert' });
    this.aberto.set(true);
    const sub = new Subject<void>();
    this.subject = sub;
    return sub.asObservable();
  }

  fechar(valor?: any): void {
    this.aberto.set(false);
    if (this.subject) {
      this.subject.next(valor);
      this.subject.complete();
      this.subject = null;
    }
  }
}
