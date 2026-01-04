import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './Components/list/list.component';
import { DetailsComponent } from './Components/details/details.component';
import { CreateComponent } from './Components/create/create.component';
import { EditComponent } from './Components/edit/edit.component';
import { DeleteComponent } from './Components/delete/delete.component';
import { SharedTranslationsModule } from '../Shared/shared-translations.module';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewsTypeRouteModule } from './news-type-route.module';



@NgModule({
  declarations: [ListComponent, DetailsComponent, CreateComponent, EditComponent, DeleteComponent],
  imports: [
    CommonModule, SharedTranslationsModule, HttpClientModule,NewsTypeRouteModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule, MatPaginatorModule, ReactiveFormsModule, MatDialogModule, MatTooltipModule,
    MatMenuModule, MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ar-EG' }
  ],
  exports: [ListComponent]
})
export class NewsTypeModule { }
