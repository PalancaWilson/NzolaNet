import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { PostCard } from './post-card';

describe('PostCard', () => {
  let component: PostCard;
  let fixture: ComponentFixture<PostCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCard],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCard);
    component = fixture.componentInstance;
    component.post = {
      id: '1', conteudo: 'teste',
      autor: { id: 'u1', nome: 'Teste', nomeUtilizador: 'teste', avatar: '' },
      gostos: 0, comentarios: 0, partilhas: 0, guardados: 0,
      gostou: false, guardado: false,
      tempoDecorrido: 'agora', etiquetas: [],
    };
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
