import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NewsRouteModule } from './news-route.module';
import { ListComponent } from './Components/list/list.component';
import { DetailsComponent } from './Components/details/details.component';
import { CreateComponent } from './Components/create/create.component';
import { EditComponent } from './Components/edit/edit.component';
import { DeleteComponent } from './Components/delete/delete.component';
import { SharedTranslationsModule } from '../Shared/shared-translations.module';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [ListComponent, DetailsComponent, CreateComponent, EditComponent, DeleteComponent],
  imports: [
    CommonModule, SharedTranslationsModule, HttpClientModule, NewsRouteModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule, MatPaginatorModule, ReactiveFormsModule, MatDialogModule, MatTooltipModule,
    MatMenuModule, MatDatepickerModule,
    MatNativeDateModule, MatOptionModule, MatSelectModule, NgFor,
    NgIf
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ar-EG' }
  ],
  exports: [ListComponent]
})
export class NewsModule { }
