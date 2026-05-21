import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right-sidebar',
  imports: [CommonModule],
  templateUrl: './right-sidebar.html',
  styleUrl: './right-sidebar.css',
})
export class RightSidebar {
   
  suggestions = [
    { id: 1, name: 'Palanc Wilson', subtitle: 'Seguido por Ana Clara', avatar: 'assets/tiago.jpg' },
    { id: 2, name: 'Mário Ricardo', subtitle: '12 amigos em comum', avatar: 'assets/beatriz.jpg' },
    { id: 3, name: 'Cota Moises', subtitle: 'Novo na Baze', avatar: 'assets/marco.jpg' }
  ];

  notifications = [
    { id: 1, type: 'baze', senderName: 'Lucas', text: 'deu um baze na tua publicação.', time: 'AGORA' },
    { id: 2, type: 'follow', senderName: 'Sofia', text: 'começou a seguir-te.', time: '5 MIN' },
    { id: 3, type: 'comment', senderName: 'Rui', text: 'comentou: "Top!"', time: '1 H' }
  ];

  followUser(userId: number): void {
    console.log(`Solicitação para seguir o utilizador com ID: ${userId}`);
    // Aqui ligarás ao teu serviço do Laravel para atualizar a tabela 'follows'
  }

  viewAllNotifications(): void {
    console.log('Navegar para a página completa de notificações');
  }

  // Define uma classe de ícone dependendo do tipo da resposta (ex: FontAwesome ou Boxicons)
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'baze': return 'fa-solid fa-bolt';     // Ícone de raio/baze
      case 'follow': return 'fa-solid fa-user-plus'; // Ícone de seguir
      case 'comment': return 'fa-solid fa-comment';  // Ícone de comentário
      default: return 'fa-solid fa-bell';
    }
  }
}





