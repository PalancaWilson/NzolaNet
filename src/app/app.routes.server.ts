import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'nova-senha/:token', renderMode: RenderMode.Client },
  { path: 'post/:id',          renderMode: RenderMode.Client },
  { path: 'profile/:id',       renderMode: RenderMode.Client },
  { path: '**',                renderMode: RenderMode.Prerender },
];
