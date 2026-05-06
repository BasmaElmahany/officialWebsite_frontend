import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgncyService } from '../../Services/agncy.service';
import { MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { ToastService } from '../../../Shared/Services/toast/toast.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  form: FormGroup;
  loading = false;
  selectedPhoto?: File;
  selectedDirPhoto?: File;

  constructor(
    private fb: FormBuilder,
    private agencyService: AgncyService,
    private dialogRef: MatDialogRef<CreateComponent>,
    public i18n: I18nService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      dirNameAr: [''],
      dirNameEn: [''],
      addressAr: [''],
      addressEn: [''],
      phoneNumber1: [''],
      phoneNumber2: [''],
      email: ['', Validators.email],
      faxNumber: [''],
      link: [''],
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

  /* ================= ACTIVITIES ================= */
  addActivity(): void {
    this.activities.push(
      this.fb.group({
        activityAr: ['', Validators.required],
        activityEn: ['', Validators.required]
      })
    );
  }

  removeActivity(index: number): void {
    this.activities.removeAt(index);
  }

  /* ================= SERVICES ================= */
  addService(): void {
    this.services.push(
      this.fb.group({
        serviceAr: ['', Validators.required],
        serviceEn: ['', Validators.required],
        descriptionAr: [''],
        descriptionEn: [''],
        fees: [0],
        placeAr: [''],
        placeEn: [''],
        link: [''],
        file: ['']
      })
    );
  }

  removeService(index: number): void {
    this.services.removeAt(index);
  }

  /* ================= FILE HANDLERS ================= */
  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedPhoto = input.files[0];
    }
  }

  onDirPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedDirPhoto = input.files[0];
    }
  }

  onServiceFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.services.at(index).get('file')?.setValue(input.files[0]);
    }
  }

  /* ================= SUBMIT ================= */
submit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  this.loading = true;

  const formData = new FormData();
  const formValues = this.form.value;

  // 1. الحقول الأساسية للهيئة
  // تأكدي إن الحروف الكبيرة (PascalCase) مطابقة للسوجر
  formData.append('NameAr', formValues.nameAr);
  formData.append('NameEn', formValues.nameEn);
  formData.append('DirNameAr', formValues.dirNameAr || '');
  formData.append('DirNameEn', formValues.dirNameEn || '');
  formData.append('AddressAr', formValues.addressAr || '');
  formData.append('AddressEn', formValues.addressEn || '');
  formData.append('PhoneNumber1', formValues.phoneNumber1 || '');
  formData.append('PhoneNumber2', formValues.phoneNumber2 || '');
  formData.append('Email', formValues.email || '');
  formData.append('FaxNumber', formValues.faxNumber || '');
  formData.append('Link', formValues.link || '');

  // 2. الصور الأساسية
  if (this.selectedPhoto) formData.append('PhotoUrl', this.selectedPhoto);
  if (this.selectedDirPhoto) formData.append('DirPhotoUrl', this.selectedDirPhoto);

  // 3. الأنشطة (تأكدي من استخدام الأقواس المربعة [])
  this.activities.controls.forEach((ctrl, i) => {
    formData.append(`Activities[${i}].ActivityAr`, ctrl.value.activityAr);
    formData.append(`Activities[${i}].ActivityEn`, ctrl.value.activityEn);
  });

  // 4. الخدمات (Services) - التعديل الحاسم
  this.services.controls.forEach((ctrl, i) => {
    const s = ctrl.value;
    
    // إرسال الـ ID كـ 0 والـ AgencyId كـ Empty Guid هو اللي بيمنع الـ 500 في الـ Create
    formData.append(`Services[${i}].Id`, '0'); 
    formData.append(`Services[${i}].AgencyId`, '00000000-0000-0000-0000-000000000000');

    formData.append(`Services[${i}].ServiceAr`, s.serviceAr);
    formData.append(`Services[${i}].ServiceEn`, s.serviceEn);
    formData.append(`Services[${i}].DescriptionAr`, s.descriptionAr || '');
    formData.append(`Services[${i}].DescriptionEn`, s.descriptionEn || '');
    
    // الرسوم لازم تتبعت كـ string يمثل رقم
    formData.append(`Services[${i}].Fees`, (s.fees ?? 0).toString());
    
    formData.append(`Services[${i}].PlaceAr`, s.placeAr || '');
    formData.append(`Services[${i}].PlaceEn`, s.placeEn || '');
    formData.append(`Services[${i}].Link`, s.link || '');
    
    // الملف لازم يتبعت باسمه
    if (s.file instanceof File) {
      formData.append(`Services[${i}].File`, s.file, s.file.name);
    }
  });

  this.agencyService.createAgency(formData).subscribe({
    next: () => {
      this.loading = false;
      this.toast.success('تمت الإضافة بنجاح');
      this.dialogRef.close(true);
    },
    error: (err) => {
      this.loading = false;
      // الخطوة دي مهمة جداً: افتحي تاب Network وشوفي الـ Response
      console.error('Error details:', err);
      this.toast.error('فشلت العملية، راجع بيانات الخدمات');
    }
  });
}

  close(): void {
    this.dialogRef.close(false);
  }
}