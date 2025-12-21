import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompanyRoutingModule } from './company-route.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CompanyListComponent } from './Components/list/company-list.component';
import { CompanyCreateComponent } from './Components/create/company-create.component';
import { CompanyEditComponent } from './Components/edit/company-edit.component';
import { MatIconModule } from '@angular/material/icon';
import { CompanyDetailsComponent } from './Components/details/company-details.component';
import { CompanyDeleteComponent } from './Components/delete/company-delete.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { SharedTranslationsModule } from '../Shared/shared-translations.module';

@NgModule({
  declarations: [CompanyListComponent, CompanyCreateComponent, CompanyEditComponent, CompanyDetailsComponent, CompanyDeleteComponent],
  imports: [
    CommonModule,
    RouterModule,
    CompanyRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    SharedTranslationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule
  ],
  exports: [CompanyListComponent, CompanyCreateComponent, CompanyEditComponent, CompanyDetailsComponent, CompanyDeleteComponent]
})
export class CompanyModule {}
