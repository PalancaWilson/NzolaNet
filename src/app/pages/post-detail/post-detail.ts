import { Component, Input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostCard } from '../../components/post-card/post-card';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../components/modal/modal.service';
import { Post } from '../../models/post.model';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface Comentario {
  id: string;
  autor: { nome: string; username: string; avatar: string };
  texto: string;
  tempo: string;
  bazes: number;
  bazado: boolean;
  respostaA: string | null;
}

@Component({
  selector: 'app-post-detail',
  imports: [RouterLink, PostCard, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.css',
})
export class PostDetail implements OnInit {
  @Input() id = '';

  private readonly API_URL = environment.apiUrl;

  post = signal<Post | null>(null);
  comentarios = signal<Comentario[]>([]);
  enviando = signal(false);
  replyTo = signal<string | null>(null);
  comentCtrl = new FormControl('', [Validators.required, Validators.maxLength(280)]);

  editandoId = signal<string | null>(null);
  editandoTexto = signal('');
  menuComentarioAberto = signal<string | null>(null);

  constructor(
    readonly postService: PostService,
    readonly userService: UserService,
    private modal: ModalService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    if (!this.postService.publicacoes().length) {
      this.postService.obterFeed().subscribe(() => this.carregarPost());
    } else {
      this.carregarPost();
    }
    this.carregarComentarios();
  }

  private carregarPost(): void {
    const encontrado = this.postService.publicacoes().find(p => p.id === this.id);
    if (encontrado) {
      this.post.set(encontrado);
    } else {
      this.postService.obterPorId(this.id).subscribe(p => this.post.set(p));
    }
  }

  private carregarComentarios(): void {
    this.http.get<Comentario[]>(`${this.API_URL}/publicacoes/${this.id}/comentarios`).pipe(
      catchError(() => of([])),
    ).subscribe(c => this.comentarios.set(c));
  }

  get restantes(): number {
    return 280 - (this.comentCtrl.value?.length ?? 0);
  }

  get replyingToNome(): string {
    if (!this.replyTo()) return '';
    const c = this.comentarios().find(c => c.id === this.replyTo());
    return c?.autor.nome ?? '';
  }

  iniciarResposta(comentarioId: string): void {
    this.replyTo.set(comentarioId);
    this.comentCtrl.setValue('');
    this.comentCtrl.markAsUntouched();
    const textarea = document.querySelector<HTMLTextAreaElement>('.comment-field textarea');
    textarea?.focus();
  }

  cancelarResposta(): void {
    this.replyTo.set(null);
    this.comentCtrl.setValue('');
  }

  enviarComentario(): void {
    if (this.comentCtrl.invalid || !this.comentCtrl.value?.trim()) return;
    this.enviando.set(true);

    const body: any = {
      texto: this.comentCtrl.value!.trim(),
      resposta_a: this.replyTo(),
    };

    this.http.post<Comentario>(`${this.API_URL}/publicacoes/${this.id}/comentarios`, body).subscribe({
      next: novo => {
        this.comentarios.update(lista => [novo, ...lista]);
        this.comentCtrl.reset();
        this.replyTo.set(null);
        this.enviando.set(false);
      },
      error: () => {
        this.enviando.set(false);
      },
    });
  }

  toggleBazeComentario(id: string): void {
    this.http.post(`${this.API_URL}/comentarios/${id}/baze`, {}).subscribe({
      next: () => {
        this.comentarios.update(lista =>
          lista.map(c =>
            c.id === id
              ? { ...c, bazado: !c.bazado, bazes: c.bazado ? c.bazes - 1 : c.bazes + 1 }
              : c,
          ),
        );
      },
    });
  }

  isOwnerComentario(c: Comentario): boolean {
    return c.autor.username === this.userService.nome().toLowerCase().replace(' ', '_');
  }

  toggleMenuComentario(id: string): void {
    this.menuComentarioAberto.update(v => (v === id ? null : id));
  }

  fecharMenuComentario(): void {
    this.menuComentarioAberto.set(null);
  }

  iniciarEdicaoComentario(id: string): void {
    const c = this.comentarios().find(c => c.id === id);
    if (!c) return;
    this.editandoId.set(id);
    this.editandoTexto.set(c.texto);
    this.menuComentarioAberto.set(null);
  }

  cancelarEdicaoComentario(): void {
    this.editandoId.set(null);
    this.editandoTexto.set('');
  }

  guardarEdicaoComentario(id: string): void {
    const texto = this.editandoTexto().trim();
    if (!texto) return;
    this.http.put(`${this.API_URL}/comentarios/${id}`, { texto }).subscribe({
      next: () => {
        this.comentarios.update(lista =>
          lista.map(c => (c.id === id ? { ...c, texto } : c)),
        );
        this.cancelarEdicaoComentario();
      },
    });
  }

  apagarComentario(id: string): void {
    this.menuComentarioAberto.set(null);
    this.modal.confirmar('Apagar comentário', 'Tens a certeza que queres apagar este comentário?', { confirmar: 'Apagar', cancelar: 'Manter' })
      .subscribe(confirmado => {
        if (confirmado) {
          this.http.delete(`${this.API_URL}/comentarios/${id}`).subscribe({
            next: () => {
              this.comentarios.update(lista => lista.filter(c => c.id !== id));
            },
          });
        }
      });
  }

  editarPost(): void {
    const p = this.post();
    if (!p) return;
    this.modal.prompt('Editar publicação', 'Altera o texto da tua publicação:', p.conteudo, 'Escreve o novo texto...')
      .subscribe(novo => {
        if (novo && novo.trim() !== p.conteudo) {
          this.postService.editarPost(p.id, novo.trim()).subscribe(actualizado => {
            this.post.set(actualizado);
          });
        }
      });
  }

  apagarPost(): void {
    const p = this.post();
    if (!p) return;
    this.modal.confirmar('Apagar publicação', 'Tens a certeza que queres apagar esta publicação? Esta ação não pode ser desfeita.', { confirmar: 'Apagar', cancelar: 'Manter' })
      .subscribe(confirmado => {
        if (confirmado) {
          this.postService.apagarPost(p.id).subscribe();
          window.location.href = '/feed';
        }
      });
  }
}
