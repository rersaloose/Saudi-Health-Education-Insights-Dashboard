import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
 loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.Dashboard)  },
  {
    path: 'about',
 loadComponent: () =>
      import('./features/about/about').then(m => m.About)  }

];
