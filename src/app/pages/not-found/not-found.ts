import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="nf">
      <span class="nf-code">404</span>
      <h1>PÁGINA NÃO ENCONTRADA</h1>
      <p>Parece que te perdeste na Baze. Vamos de volta?</p>
      <a routerLink="/feed" class="nf-btn">
        <i class="bi bi-house-fill"></i> Ir para o Feed
      </a>
    </div>
  `,
  styles: [`
    .nf {
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center; text-align: center;
      padding: 40px 20px; background: var(--bg);
    }
    .nf-code {
      font-size: 120px; font-weight: 900; line-height: 1;
      background: linear-gradient(135deg, var(--purple), #8b5cf6);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    h1 { font-size: 24px; font-weight: 900; margin: 8px 0 12px; }
    p  { color: var(--text-muted); font-size: 16px; margin-bottom: 32px; }
    .nf-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: linear-gradient(135deg, var(--purple), #8b5cf6);
      color: #fff; padding: 14px 28px; border-radius: 20px;
      font-weight: 700; font-size: 15px; transition: opacity .2s;
    }
    .nf-btn:hover { opacity: .88; }
  `],
})
export class NotFound {}
