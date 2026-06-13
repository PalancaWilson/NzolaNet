import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationCard } from './notification-card';

describe('NotificationCard', () => {
  let component: NotificationCard;
  let fixture: ComponentFixture<NotificationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationCard],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationCard);
    component = fixture.componentInstance;
    component.notification = {
      id: 'n1', type: 'baze', lida: false, tempoDecorrido: 'há 1 min',
      utilizador: { nome: 'Teste', nomeUtilizador: 'teste', avatar: '' },
      mensagem: 'deu baze à tua publicação',
    };
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
