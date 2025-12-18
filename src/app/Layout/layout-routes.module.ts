import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './Components/dashboard-layout/dashboard-layout.component';


const routes: Routes = [

  { path: 'dashboard', component: DashboardLayoutComponent },
  { path: '', component: DashboardLayoutComponent },

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutesModule { }
