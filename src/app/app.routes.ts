import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import {guestGuard} from './guards/guest.guard';




export const routes: Routes = [

    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },

    {
        path:'register',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/register/register').then(m => m.Register)
    },
    {
        path:'feed',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/feed/feed').then(m => m.Feed)
    },
    {
        path:'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/profile/profile').then(m => m.Profile)
    },
    {
        path: 'notifications',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/notifications/notifications').then(m => m.Notification)
    },
    {
      path: 'stored',
      canActivate: [authGuard],
      loadComponent: () => import('./pages/stored/stored').then(m => m.Stored)
    },
    {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/settings/settings').then(m => m.Settings),

    children: [

      {
        path: '',
        redirectTo: 'conta',
        pathMatch: 'full'
      },

      {
        path: 'conta',
        loadComponent: () => import('./pages/settings/conta/conta').then(m => m.Conta)
      },

      {
        path: 'notificacoes',
        loadComponent: () => import('./pages/settings/notificacoes/notificacoes').then(m => m.Notificacoes)
      },

      {
        path: 'privado',
        loadComponent: () => import('./pages/settings/privado/privado').then(m => m.Privado)
      },

      {
        path: 'aparencia',
        loadComponent: () => import('./pages/settings/aparencia/aparencia').then(m => m.Aparencia)
      },

      {
        path: 'idioma',
        loadComponent: () => import('./pages/settings/idiomas/idiomas').then(m => m.Idiomas)
      }

    ]
  },
     
    {
        path: 'profile/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/profile-id/profile-id').then(m => m.ProfileId)
    },
    {
      path: '**',
      redirectTo: 'feed'
    },

];
