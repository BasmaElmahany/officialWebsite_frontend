import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './Components/list/company-list.component';
import { CompanyCreateComponent } from './Components/create/company-create.component';

const routes: Routes = [
	{ path: '', redirectTo: 'list', pathMatch: 'full' },
	{ path: 'list', component: CompanyListComponent },
	{ path: 'create', component: CompanyCreateComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CompanyRoutingModule {}
