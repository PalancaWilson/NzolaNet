import { Component, signal, effect, viewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  imports: [FormsModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class AppModal {
  valorInput = signal('');

  constructor(readonly modal: ModalService) {
    effect(() => {
      if (this.modal.aberto()) {
        this.valorInput.set(this.modal.config()?.valorInicial ?? '');
      }
    });

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.modal.aberto()) {
          this.cancelar();
        }
      });
    }
  }

  cfg() {
    return this.modal.config();
  }

  confirmar(): void {
    this.fechar();
  }

  cancelar(): void {
    this.modal.fechar(null);
  }

  private fechar(): void {
    const c = this.cfg();
    if (!c) return;
    if (c.modo === 'prompt') {
      this.modal.fechar(this.valorInput());
    } else if (c.modo === 'alert') {
      this.modal.fechar();
    } else {
      this.modal.fechar(true);
    }
  }
}
