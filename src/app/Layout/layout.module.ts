import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedTranslationsModule } from '../Shared/shared-translations.module';
import { LayoutRoutesModule } from './layout-routes.module';
import { DashboardLayoutComponent } from './Components/dashboard-layout/dashboard-layout.component';



@NgModule({
  declarations: [DashboardLayoutComponent],
  imports: [
    CommonModule, SharedTranslationsModule, LayoutRoutesModule
  ],
  exports: [DashboardLayoutComponent]
})
export class LayoutModule { }
