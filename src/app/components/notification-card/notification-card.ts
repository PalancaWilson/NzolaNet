import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notification-card',
  imports: [CommonModule],
  templateUrl: './notification-card.html',
  styleUrl: './notification-card.css',
})
export class NotificationCard {
  notification: Notification = {} as Notification;

  getBadgeIcon(badge?: string): string {
    if (badge === 'creator')  return '⚡';
    if (badge === 'verified') return '✓';
    if (badge === 'premium')  return '★';
    return '';
  }

  getTypeIcon(): string {
    switch (this.notification.type) {
      case 'baze':    return 'bolt';
      case 'follow':  return 'person';
      case 'comment': return 'chat';
      case 'mention': return 'at';
      default:        return 'bolt';
    }
  }
}
