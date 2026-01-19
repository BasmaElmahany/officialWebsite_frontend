import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// الأهم: استيراد موديول الترجمة المشترك
import { SharedTranslationsModule } from '../Shared/shared-translations.module'; 

// Components
import { CreateComponent } from './Components/create/create.component';
import { EditComponent } from './Components/edit/edit.component';
import { DeleteComponent } from './Components/delete/delete.component';
import { DetailsComponent } from './Components/details/details.component';
import { ListComponent } from './Components/list/list.component';

// Routing & Services
import { AdministrativeDevicesRoutingModule } from './administrative-devices-routing.module';
import { AdministrativeDevicesService } from './Services/administrative-devices.service';

@NgModule({
  declarations: [
    CreateComponent,
    EditComponent,
    DeleteComponent,
    DetailsComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedTranslationsModule, // ده بيشغل الـ translate pipe
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    AdministrativeDevicesRoutingModule
  ],
  providers: [
    AdministrativeDevicesService
  ],
  exports: [
    ListComponent
  ]
})
export class AdministrativeDevicesModule { }