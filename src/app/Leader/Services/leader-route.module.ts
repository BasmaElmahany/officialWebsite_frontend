import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from '../Components/list/list.component';
import { CreateComponent } from '../Components/create/create.component';
import { DetailsComponent } from '../Components/details/details.component';
import { EditComponent } from '../Components/edit/edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
  { path: 'create', component: CreateComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: ':id', component: DetailsComponent },
    { path: '', redirectTo: 'list', pathMatch: 'full' },
  // Add other routes as needed
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaderRoutingModule { }
