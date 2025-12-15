import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { AgGridModule } from 'ag-grid-angular';
import { GridOptions  } from "ag-grid-community";
import "ag-grid-enterprise"
// modifica da local su testAgEnterprice
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);


registerLocaleData(localeIt);
/*bootstrapApplication(App, appConfig {
  providers: [
   // provideHttpClient()
  ]
  
}).catch((err) => console.error(err));*/

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'it-IT' }
  ]
})
.catch((err) => console.error(err));


/*bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));*/
