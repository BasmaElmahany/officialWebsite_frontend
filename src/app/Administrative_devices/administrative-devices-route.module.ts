import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './Components/list/list.component';

// تعريف المسارات
const routes: Routes = [
  {
    path: '', // المسار الرئيسي للموديول
    component: ListComponent,
    data: { title: 'Administrative Devices' } // يمكنك إضافة عنوان للصفحة هنا
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // استخدام forChild لأن هذا موديول فرعي
  exports: [RouterModule]
})
export class AdministrativeDevicesRoutingModule { }