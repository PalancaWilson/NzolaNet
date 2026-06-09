export type NotificationType = 'baze' | 'follow' | 'comment' | 'mention';

export interface Notifications {
  id: string;
  type: NotificationType;
  user: {
    name: string;
    username: string;
    avatar: string;
    badge?: 'creator' | 'verified' | 'premium';
  };
  message: string;
  timeAgo: string;
  read: boolean;
  postTitle?: string;
}
