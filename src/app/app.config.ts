import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay} from '@angular/platform-browser';
import { provideHttpClient, withInterceptors,withFetch } from '@angular/common/http';
import { authInterceptor } from  './interceptor/auth.interceptor';
import { httpErrorInterceptor } from './interceptor/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor, httpErrorInterceptor]), withFetch() ),
  ]
};








