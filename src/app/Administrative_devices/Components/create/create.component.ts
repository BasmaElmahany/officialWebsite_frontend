import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AdministrativeDevicesService } from '../../Services/administrative-devices.service';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { ToastService } from '../../../Shared/Services/toast/toast.service';

@Component({
  selector: 'app-administrative-devices-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: false 
})
export class CreateComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private deviceService: AdministrativeDevicesService,
    public i18n: I18nService, 
    private toast: ToastService,
    private dialogRef: MatDialogRef<CreateComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      serialNumber: [''],
      type: [''],
      status: [''],
      location: [''],
      purchaseDate: [''],
      warrantyEndDate: [''],
      notes: [''],
      activities: this.fb.array([]),
      services: this.fb.array([])
    });
  }

  get activities(): FormArray {
    return this.form.get('activities') as FormArray;
  }

  get services(): FormArray {
    return this.form.get('services') as FormArray;
  }

  addActivity() {
    this.activities.push(this.fb.group({
      activityAr: ['', Validators.required],
      activityEn: ['', Validators.required]
    }));
  }

  removeActivity(index: number) {
    this.activities.removeAt(index);
  }

  addService(): void {
    this.services.push(
      this.fb.group({
        id: [0],
        deviceId: [''], 
        serviceAr: ['', Validators.required],
        serviceEn: ['', Validators.required],
        descriptionAr: [''],
        descriptionEn: [''],
        fees: [0],
        placeAr: [''],
        placeEn: [''],
        link: [''],
        file: [null] // يتم تخزين كائن الملف هنا
      })
    );
  }

  removeService(index: number) {
    this.services.removeAt(index);
  }

  // 🔥 الدالة التي كانت مفقودة وتسببت في الخطأ
  onServiceFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.services.at(index).patchValue({ file: file });
    }
  }

  onPhotoChange(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const formData = new FormData();
    const rawValues = this.form.getRawValue();

    // 1. إضافة الحقول الأساسية
    Object.keys(rawValues).forEach(key => {
      if (key !== 'activities' && key !== 'services' && rawValues[key] != null) {
        formData.append(key, rawValues[key]);
      }
    });

    // 2. إضافة الأنشطة
    this.activities.controls.forEach((ctrl, i) => {
      formData.append(`Activities[${i}].ActivityAr`, ctrl.value.activityAr);
      formData.append(`Activities[${i}].ActivityEn`, ctrl.value.activityEn);
    });

    // 3. إضافة الخدمات (تم التحديث ليشمل كافة الحقول الجديدة)
    this.services.controls.forEach((ctrl, i) => {
      const s = ctrl.value;
      formData.append(`Services[${i}].ServiceAr`, s.serviceAr || '');
      formData.append(`Services[${i}].ServiceEn`, s.serviceEn || '');
      formData.append(`Services[${i}].DescriptionAr`, s.descriptionAr || '');
      formData.append(`Services[${i}].DescriptionEn`, s.descriptionEn || '');
      formData.append(`Services[${i}].Fees`, s.fees?.toString() || '0');
      formData.append(`Services[${i}].PlaceAr`, s.placeAr || '');
      formData.append(`Services[${i}].PlaceEn`, s.placeEn || '');
      formData.append(`Services[${i}].Link`, s.link || '');
      
      // إضافة ملف الخدمة إذا وُجد
      if (s.file instanceof File) {
        formData.append(`Services[${i}].File`, s.file);
      }
    });

    // 4. إضافة صورة الجهاز الأساسية
    if (this.selectedFile) {
      formData.append('Photo', this.selectedFile);
    }

    this.deviceService.create(formData).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success(this.i18n.currentLang === 'ar' ? 'تم الحفظ بنجاح' : 'Saved Successfully');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(this.i18n.currentLang === 'ar' ? 'فشل في الحفظ' : 'Save Failed');
        console.error('Create failed', err);
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}