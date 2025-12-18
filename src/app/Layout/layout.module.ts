import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedTranslationsModule } from '../Shared/shared-translations.module';
import { DashboardLayoutComponent } from './Components/dashboard-layout/dashboard-layout.component';
import { CenterModule } from '../Center/center.module';
import {  RouterModule } from '@angular/router';



@NgModule({
  declarations: [DashboardLayoutComponent],
  imports: [
    CommonModule, SharedTranslationsModule , CenterModule , RouterModule
  ],
  exports: [DashboardLayoutComponent]
})
export class LayoutModule { }
