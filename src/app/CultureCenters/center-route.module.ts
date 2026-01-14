import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './Components/list/list.component';
import { CreateComponent } from '../Center/Components/create/create.component';
import { EditComponent } from '../Directorate/Components/edit/edit.component';
import { DetailsComponent } from '../Leader/Components/details/details.component';



const routes: Routes = [

  { path: 'list', component: ListComponent },
  { path: 'add', component: CreateComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: ':id', component: DetailsComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' },

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocietyRouteModule { }

export class CenterRouteModule { }
