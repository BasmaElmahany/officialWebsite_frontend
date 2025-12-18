import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./Auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./Auth/auth.module').then(m => m.AuthModule)
  }
];
