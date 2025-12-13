
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Home } from './home/home';

// Componenti figli
import { DashboardComponent } from './dashboard/dashboard.component';
//import { UtentiComponent } from './utenti/utenti.component';
//import { ReportComponent } from './report/report.component';

import { ListaFattureComponent } from './lista-fatture/lista-fatture.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
  
    {
      path: 'home',
      component: Home,
      children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'listaFatture'   , component: ListaFattureComponent },
  //      { path: 'report', component: ReportComponent },
        { path: '', redirectTo: 'login', pathMatch: 'full' }
      ]
    },
  
    { path: '', redirectTo: 'login', pathMatch: 'full' }
  ];