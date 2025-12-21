import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedTranslationsModule } from '../Shared/shared-translations.module';
import { CreateComponent } from './Components/create/create.component';
import { ListComponent } from './Components/list/list.component';
import { EditComponent } from './Components/edit/edit.component';
import { DeleteComponent } from './Components/delete/delete.component';
import { DetailsComponent } from './Components/details/details.component';
import { DirectorateRouteModule } from './directorate-route.module';



@NgModule({
  declarations: [CreateComponent,ListComponent,EditComponent,DeleteComponent,DetailsComponent],
  imports: [
    CommonModule , SharedTranslationsModule, HttpClientModule,DirectorateRouteModule,
        MatTableModule,
       MatIconModule,
       MatProgressSpinnerModule,
        MatSortModule,
       MatInputModule,
       MatFormFieldModule,MatPaginatorModule, ReactiveFormsModule,MatDialogModule,MatTooltipModule,
       MatMenuModule
  ], 
  exports : [ListComponent]
})
export class DirectorateModule { }
