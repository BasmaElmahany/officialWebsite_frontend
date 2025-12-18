import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './Components/list/list.component';
import { CreateComponent } from './Components/create/create.component';



const routes: Routes = [

  { path: 'list', component:ListComponent  },
   { path: 'add', component:CreateComponent  },
  { path: '', component: ListComponent },

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterRouteModule { }
