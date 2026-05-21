export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  bazes: number;
  isFollowing?: boolean;
  badge?: 'creator' | 'verified' | 'premium';
}
