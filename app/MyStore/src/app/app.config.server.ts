import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // added this to solve critical error i faced it before (in data retreiving)
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
