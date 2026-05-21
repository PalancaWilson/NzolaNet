import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(HttpClientModule)
  ]
})
  .catch((err) => console.error(err));
