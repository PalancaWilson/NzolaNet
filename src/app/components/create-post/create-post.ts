import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { ModalService } from '../modal/modal.service';

@Component({
  selector: 'app-create-post',
  imports: [FormsModule],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
})
export class CreatePost {
  text = signal('');
  publicando = signal(false);
  readonly limite = 1024;

  selectedImage = signal<string | null>(null);
  selectedVideo = signal<string | null>(null);
  showEmojiPicker = signal(false);

  readonly emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '🔥', '💜', '🎉', '👏', '💯'];

  constructor(
    private postService: PostService,
    readonly userService: UserService,
    private modal: ModalService,
  ) {}

  get restantes(): number {
    return this.limite - this.text().length;
  }
  get quaseNoLimite(): boolean {
    return this.restantes <= 80;
  }

  onImageSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.selectedImage.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onVideoSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.selectedVideo.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  removerImagem(): void {
    this.selectedImage.set(null);
  }

  removerVideo(): void {
    this.selectedVideo.set(null);
  }

  inserirEmoji(emoji: string): void {
    this.text.update(t => t + emoji);
    this.showEmojiPicker.set(false);
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker.update(v => !v);
  }

  /**
   * Para poder publicar a localização atual
   */
  localizacao(): void {
    this.modal.alertar('Localização', 'Funcionalidade de localização em breve!');
  }

  publicar(): void {
    if (!this.text().trim() || this.publicando()) return;
    this.publicando.set(true);
    this.postService.criarPost(this.text().trim(), this.selectedImage() ?? undefined).subscribe({
      next: () => {
        this.text.set('');
        this.selectedImage.set(null);
        this.selectedVideo.set(null);
        this.publicando.set(false);
      },
      error: () => {
        this.publicando.set(false);
      },
    });
  }
}
