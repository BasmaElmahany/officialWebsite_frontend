import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './Components/list/list.component';
import { EditComponent } from './Components/edit/edit.component';
import { CreateComponent } from './Components/create/create.component';
import { DeleteComponent } from './Components/delete/delete.component';
import { SharedTranslationsModule } from '../Shared/shared-translations.module';
import { HttpClientModule } from '@angular/common/http';
import { CenterRouteModule } from './center-route.module';
/* Angular Material */
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [ListComponent,EditComponent,CreateComponent,DeleteComponent],
  imports: [
    CommonModule , SharedTranslationsModule, HttpClientModule,CenterRouteModule,
     MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
     MatSortModule,
    MatInputModule,
    MatFormFieldModule,MatPaginatorModule, ReactiveFormsModule,MatDialogModule

  ],
  exports : [ListComponent] 
})
export class CenterModule { }
