import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterComponent } from './Components/register/register.component';
import { LoginComponent } from './Components/login/login.component';
import { AuthRouteModule } from './auth-route.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [RegisterComponent , LoginComponent],
  imports: [
    CommonModule,
    AuthRouteModule,
    ReactiveFormsModule
  ],
  exports :[LoginComponent]
})
export class AuthModule { }
