import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';






const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRouteModule { }
