import { Routes } from '@angular/router';
import { authGuard }  from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [

  /* ── Raiz ──────────────────────────────────────────────────────── */
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  /* ── Páginas públicas (sem shell, sem autenticação) ─────────────── */
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    title: 'Entrar · NzolaNet'
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register/register').then(m => m.Register),
    title: 'Criar conta · NzolaNet'
  },
  {
    path: 'recuperar-senha',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/recuperar-senha/recuperar-senha').then(m => m.RecuperarSenha),
    title: 'Recuperar senha · NzolaNet'
  },
  {
    path: 'nova-senha/:token',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/nova-senha/nova-senha').then(m => m.NovaSenha),
    title: 'Nova senha · NzolaNet'
  },

  /* ── AppShell (topbar + sidebar fixos, autenticação obrigatória) ── */
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/app-shell/app-shell').then(m => m.AppShell),
    children: [

      // Feed
      {
        path: 'feed',
        loadComponent: () => import('./pages/feed/feed').then(m => m.Feed),
        title: 'Feed · NzolaNet'
      },

      // Explorar
      {
        path: 'explorar',
        loadComponent: () => import('./pages/explore/explore').then(m => m.Explore),
        title: 'Explorar · NzolaNet'
      },

      // Mensagens
      {
        path: 'mensagens',
        loadComponent: () => import('./pages/mensagens/mensagens').then(m => m.Mensagens),
        title: 'Mensagens · NzolaNet'
      },

      // Post individual
      {
        path: 'post/:id',
        loadComponent: () => import('./pages/post-detail/post-detail').then(m => m.PostDetail),
        title: 'Publicação · NzolaNet'
      },

      // Notificações
      {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/notifications').then(m => m.Notification),
        title: 'Notificações · NzolaNet'
      },

      // Guardados
      {
        path: 'guardados',
        loadComponent: () => import('./pages/stored/stored').then(m => m.Stored),
        title: 'Guardados · NzolaNet'
      },

      // Perfil próprio
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then(m => m.Profile),
        title: 'O meu perfil · NzolaNet'
      },

      // Perfil de outro utilizador
      {
        path: 'profile/:id',
        loadComponent: () => import('./pages/profile-id/profile-id').then(m => m.ProfileId),
        title: 'Perfil · NzolaNet'
      },

      // Edit-profile → redirect para settings/conta
      {
        path: 'edit-profile',
        loadComponent: () => import('./pages/edit-profile/edit-profile').then(m => m.EditProfile),
      },

      // Sobre
      {
        path: 'sobre',
        loadComponent: () => import('./pages/sobre/sobre').then(m => m.Sobre),
        title: 'Sobre · NzolaNet'
      },

      // Termos
      {
        path: 'termos',
        loadComponent: () => import('./pages/termos/termos').then(m => m.Termos),
        title: 'Termos de Serviço · NzolaNet'
      },

      // Definições (com rotas filhas)
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then(m => m.Settings),
        title: 'Definições · NzolaNet',
        children: [
          { path: '',           redirectTo: 'conta', pathMatch: 'full' },
          { path: 'conta',        loadComponent: () => import('./pages/settings/conta/conta').then(m => m.Conta),        title: 'Conta · NzolaNet' },
          { path: 'notificacoes', loadComponent: () => import('./pages/settings/notificacoes/notificacoes').then(m => m.Notificacoes), title: 'Notificações · NzolaNet' },
          { path: 'privado',      loadComponent: () => import('./pages/settings/privado/privado').then(m => m.Privado),  title: 'Privacidade · NzolaNet' },
          { path: 'aparencia',    loadComponent: () => import('./pages/settings/aparencia/aparencia').then(m => m.Aparencia), title: 'Aparência · NzolaNet' },
          { path: 'idioma',       loadComponent: () => import('./pages/settings/idiomas/idiomas').then(m => m.Idiomas),  title: 'Idioma · NzolaNet' },
        ],
      },
    ],
  },

  /* ── 404 ──────────────────────────────────────────────────────────── */
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound),
    title: 'Página não encontrada · NzolaNet'
  },
  { path: '**', redirectTo: '404' },
];
