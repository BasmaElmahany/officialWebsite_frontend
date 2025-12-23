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
        path: 'centers',
        loadChildren: () =>
          import('./Center/center.module').then(m => m.CenterModule)
      },
      {
        path: 'companies',
        loadChildren: () =>
          import('./Company/company.module').then(m => m.CompanyModule)
      },
      {
        path: 'leaders',
        loadChildren: () =>
          import('../app/Leader/Services/leader.module').then(m => m.LeaderModule)
      },
      {
        path: 'agencies',
        loadChildren: () =>
          import('./Agency/agency.module').then(m => m.AgencyModule)
      },
      {
        path: 'directorates',
        loadChildren: () =>
          import('./Directorate/directorate.module').then(m => m.DirectorateModule)
      }
      ,
      {
        path: 'govtours',
        loadChildren: () =>
          import('./GovTours/govtours.module').then(m => m.GovtoursModule)
      }
    ]
  }
];

