import { Component } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { Topbar } from "../../components/topbar/topbar";
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  type: 'baze' | 'comment' | 'follower' | 'reply';
  user: {
    name: string;
    username: string;
    avatar?: string;
  };
  content?: string;
  timestamp: string;
  read: boolean;
  postTitle?: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, Sidebar, Topbar],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css']
})
export class Notifications {
  
  activeFilter: string = 'all';
  
  notifications: Notification[] = [
    {
      id: 1,
      type: 'baze',
      user: {
        name: 'Marco Aurélio',
        username: '@MARCO_DEV'
      },
      postTitle: '“Primeiro dia na Baze...”',
      timestamp: 'Há 2 minutos',
      read: false
    },
    {
      id: 2,
      type: 'follower',
      user: {
        name: 'Ana Clara',
        username: '@ANA_ARTE'
      },
      timestamp: 'Há 18 minutos',
      read: false
    },
    {
      id: 3,
      type: 'comment',
      user: {
        name: 'Beatriz Lima',
        username: '@BE_TRIPS'
      },
      content: 'Adoro a tua paleta, partilha mais!',
      timestamp: 'Há 1 hora',
      read: false
    },
    {
      id: 4,
      type: 'baze',
      user: {
        name: 'Tiago Silva',
        username: '@TIAGO_TECH'
      },
      content: 'e mais 12 deram baze',
      postTitle: 'ao teu vídeo.',
      timestamp: 'Há 4 horas',
      read: true
    },
    {
      id: 5,
      type: 'follower',
      user: {
        name: 'Marco Aurélio',
        username: '@MARCO_DEV'
      },
      timestamp: 'Ontem',
      read: true
    },
    {
      id: 6,
      type: 'reply',
      user: {
        name: 'Ana Clara',
        username: '@ANA_ARTE'
      },
      content: 'respondeu ao teu comentário em',
      postTitle: '“A criatividade não é um dom...”',
      timestamp: 'Há 2 dias',
      read: true
    }
  ];

  get filteredNotifications(): Notification[] {
    if (this.activeFilter === 'all') {
      return this.notifications;
    }
    return this.notifications.filter(n => n.type === this.activeFilter);
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  getNotificationIcon(type: string): string {
    switch(type) {
      case 'baze':
        return 'bi bi-heart-fill';
      case 'comment':
        return 'bi bi-chat-fill';
      case 'follower':
        return 'bi bi-person-plus-fill';
      case 'reply':
        return 'bi bi-reply-fill';
      default:
        return 'bi bi-bell-fill';
    }
  }

  getNotificationColor(type: string): string {
    switch(type) {
      case 'baze':
        return '#f91880';
      case 'comment':
        return '#1da1f2';
      case 'follower':
        return '#00ba7c';
      case 'reply':
        return '#c92df1';
      default:
        return '#536471';
    }
  }
}
