import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  { path: 'home', loadComponent: () => import('./Pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'leaders', loadComponent: () => import('./Pages/leaders/leaders.component').then(m => m.LeadersComponent) },
  { path: 'govtours', loadComponent: () => import('./Pages/gov-tours/gov-tours.component').then(m => m.GovToursComponent) },
  {
    path: 'gov-tours/details',
    loadComponent: () =>
      import('./Pages/gov-tour-details/gov-tour-details.component')
        .then(m => m.GovTourDetailsComponent)
  },
  { path: 'news', loadComponent: () => import('./Pages/news/news.component').then(m => m.NewsComponent) },
  {
    path: 'news/details',
    loadComponent: () =>
      import('./Pages/news-details/news-details.component')
        .then(m => m.NewsDetailsComponent)
  },
  { path: 'directorates', loadComponent: () => import('./Pages/Directorates/Components/directorates/directorates.component').then(m => m.DirectoratesComponent) },
  {
    path: 'directorates/details',
    loadComponent: () =>
      import('./Pages/Directorates/Components/directorates-details/directorates-details.component')
        .then(m => m.DirectoratesDetailsComponent)
  },
  { path: 'tourism', loadComponent: () => import('./Pages/tourism-page/tourism-page.component').then(m => m.TourismFormalComponent) },
  //{ path: 'investment', loadComponent: () => import('./pages/investment/investment.component').then(m => m.InvestmentComponent) },
  //{ path: 'services', loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent) },
  //{ path: 'archive', loadComponent: () => import('./pages/archive/archive.component').then(m => m.ArchiveComponent) },
  //{ path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  //{ path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  //{ path: 'health', loadComponent: () => import('./pages/health/health.component').then(m => m.HealthComponent) },
  //{ path: 'education', loadComponent: () => import('./pages/education/education.component').then(m => m.EducationComponent) },
  //{ path: 'social-services', loadComponent: () => import('./pages/social-services/social-services.component').then(m => m.SocialServicesComponent) },

  // 13th page (optional)
  //{ path: 'news', loadComponent: () => import('./pages/news/news.component').then(m => m.NewsComponent) },
  { path: 'companies', loadComponent: () => import('./Pages/company/Components/companies/companies.component').then(m => m.CompaniesComponent) },
  {
    path: 'companies/details',
    loadComponent: () => import('./Pages/company/Components/companies-details/companies-details.component').then(m => m.CompaniesDetailsComponent)
  },
  { path: 'agencies', loadComponent: () => import('./Pages/Agencies/Components/Agencies/Agencies.component').then(m => m.AgenciesComponent) },
  {
    path: 'agencies/details',
    loadComponent: () => import('./Pages/Agencies/Components/Agencies-details/Agencies-details.component')
      .then(m => m.AgenciesDetailsComponent)
  },
  { path: '**', redirectTo: 'home' },
];