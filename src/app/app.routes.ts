import { Routes } from '@angular/router';
import { LayoutModule } from './Layout/layout.module';
import { DashboardLayoutComponent } from './Layout/Components/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./Auth/auth.module').then(m => m.AuthModule)
  },
   

  {
    path: 'dashboard',
    component: DashboardLayoutComponent, 
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./Center/center.module').then(m => m.CenterModule)
      }
    ]
  }
];

