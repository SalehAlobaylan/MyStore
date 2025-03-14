import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { provideHttpClient, withFetch } from '@angular/common/http'; 

// bootstrapApplication(AppComponent, appConfig) // there was problem so fixed it
//   .catch((err) => console.error(err));

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // added this to solve a critical error faced it before (in data retreiving)
    provideHttpClient(withFetch()) 
  ]
});