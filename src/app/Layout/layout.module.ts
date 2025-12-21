import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedTranslationsModule } from '../Shared/shared-translations.module';
import { DashboardLayoutComponent } from './Components/dashboard-layout/dashboard-layout.component';
import { CenterModule } from '../Center/center.module';
import {  RouterModule } from '@angular/router';
import { A11yModule } from "@angular/cdk/a11y";



@NgModule({
  declarations: [DashboardLayoutComponent],
  imports: [
    CommonModule, SharedTranslationsModule, CenterModule, RouterModule,
    A11yModule
],
  exports: [DashboardLayoutComponent]
})
export class LayoutModule { }
