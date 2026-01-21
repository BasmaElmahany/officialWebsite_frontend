import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './Components/create/create.component';
import { ListComponent } from './Components/list/list.component';
import { EditComponent } from './Components/edit/edit.component';
import { DetailsComponent } from './Components/details/details.component';


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
export class VideoRouteModule { }
