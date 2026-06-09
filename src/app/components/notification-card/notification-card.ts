import { Component, Input } from '@angular/core';
import { Notifications } from '../../models/notifications.model';

@Component({
  selector: 'app-notification-card',
  imports: [],
  templateUrl: './notification-card.html',
  styleUrl: './notification-card.css',
})
export class NotificationCard {
  // @Input obrigatório — recebe a notificação do componente pai
  @Input({ required: true }) notification!: Notifications;

  getBadgeIcon(badge?: string): string {
    if (badge === 'creator')  return '⚡';
    if (badge === 'verified') return '✓';
    if (badge === 'premium')  return '★';
    return '';
  }

  getTypeIcon(): string {
    switch (this.notification.type) {
      case 'baze':    return 'bi bi-heart-fill';
      case 'follow':  return 'bi bi-person-plus-fill';
      case 'comment': return 'bi bi-chat-fill';
      case 'mention': return 'bi bi-at';
      default:        return 'bi bi-bell-fill';
    }
  }
}
