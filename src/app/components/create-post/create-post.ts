import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-create-post',
  imports: [
    FormsModule
  ],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
})
export class CreatePost {

  text       = signal('');
  publicando = signal(false);
  readonly limite = 1024;

  constructor(
    private postService: PostService,
    readonly userService: UserService
  ) {}

  get restantes(): number    { return this.limite - this.text().length; }
  get quaseNoLimite(): boolean { return this.restantes <= 20; }

  publicar(): void {
    if (!this.text().trim() || this.publicando()) return;
    this.publicando.set(true);
    this.postService.criarPost(this.text().trim()).subscribe({
      next: () => { this.text.set(''); this.publicando.set(false); },
      error: ()  => { this.publicando.set(false); },
    });
  }
}






 
