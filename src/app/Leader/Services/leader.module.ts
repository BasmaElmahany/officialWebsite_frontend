import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderRoutingModule } from './leader-route.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListComponent } from '../Components/list/list.component';
import { CreateComponent } from '../Components/create/create.component';
import { DetailsComponent } from '../Components/details/details.component';
import { EditComponent } from '../Components/edit/edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteComponent } from '../Components/delete/delete.component';
import { SharedTranslationsModule } from '../../Shared/shared-translations.module';



@NgModule({
  declarations: [ListComponent, CreateComponent, DetailsComponent, EditComponent, DeleteComponent],
  imports: [
    CommonModule,
    LeaderRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    SharedTranslationsModule
  ]
})
export class LeaderModule { }
