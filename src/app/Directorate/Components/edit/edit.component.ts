import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DirectorateService } from '../../Services/directorate.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DirectorateRead } from '../../Models/directorate';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { ToastService } from '../../../Shared/Services/toast/toast.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  form: FormGroup;
  loading = false;
  directorate!: DirectorateRead;

  photoUrl?: string;
  dirPhotoUrl?: string;
  serviceFileUrls: string[] = [];
  
  mainPhoto?: File;
  dirPhoto?: File;
  serviceFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private directorateService: DirectorateService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public i18n: I18nService, 
    private toast: ToastService
  ) {
    // بناء الفورم مع إضافة حقول العناوين
    this.form = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      dirNameAr: [''],
      dirNameEn: [''],
      addressAr: [''],
      addressEn: [''],
      phoneNumber1: [''],
      phoneNumber2: [''],
      email: ['', [Validators.email]],
      faxNumber: [''],
      link: [''],
      activities: this.fb.array([]),
      services: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadDirectorate();
  }

  loadDirectorate(): void {
    this.directorateService.getbyId(this.data.id).subscribe({
      next: d => {
        this.directorate = d;
        this.patchData(d);
      },
      error: () => {
        this.toast.error('TOAST.OPERATION_FAILED');
        this.dialogRef.close(false);
      }
    });
  }

  get activities(): FormArray {
    return this.form.get('activities') as FormArray;
  }

  get services(): FormArray {
    return this.form.get('services') as FormArray;
  }

  patchData(d: DirectorateRead): void {
    this.form.patchValue({
      nameAr: d.nameAr,
      nameEn: d.nameEn,
      dirNameAr: d.dirNameAr,
      dirNameEn: d.dirNameEn,
      addressAr: d.addressAr,
      addressEn: d.addressEn,
      phoneNumber1: d.phoneNumber1,
      phoneNumber2: d.phoneNumber2,
      email: d.email,
      faxNumber: d.faxNumber,
      link: d.link
    });

    const baseUrl = 'https://shusha.minya.gov.eg:93';
    this.photoUrl = d.photoUrl ? `${baseUrl}${d.photoUrl}` : undefined;
    this.dirPhotoUrl = (d as any).dirPhotoUrl ? `${baseUrl}${(d as any).dirPhotoUrl}` : undefined;

    // ملء الأنشطة (جعل الحقول اختيارية لتجنب تعطل الزر)
    this.activities.clear();
    d.activities?.forEach(a => {
      this.activities.push(
        this.fb.group({
          activityAr: [a.activityAr || ''],
          activityEn: [a.activityEn || '']
        })
      );
    });

    // ملء الخدمات بكافة التفاصيل
    this.services.clear();
    d.services?.forEach((s, i) => {
      this.services.push(
        this.fb.group({
          serviceAr: [s.serviceAr || '', Validators.required],
          serviceEn: [s.serviceEn || '', Validators.required],
          descriptionAr: [s.descriptionAr || ''],
          descriptionEn: [s.descriptionEn || ''],
          fees: [s.fees || 0],
          placeAr: [s.placeAr || ''],
          placeEn: [s.placeEn || '']
        })
      );
      this.serviceFileUrls[i] = s.file ? `${baseUrl}${s.file}` : '';
    });
  }

  addActivity() {
    this.activities.push(this.fb.group({
      activityAr: [''],
      activityEn: ['']
    }));
  }

  removeActivity(i: number) {
    this.activities.removeAt(i);
  }

  addService() {
    this.services.push(this.fb.group({
      serviceAr: ['', Validators.required],
      serviceEn: ['', Validators.required],
      descriptionAr: [''],
      descriptionEn: [''],
      fees: [0],
      placeAr: [''],
      placeEn: ['']
    }));
  }

  removeService(i: number) {
    this.services.removeAt(i);
    this.serviceFiles.splice(i, 1);
    this.serviceFileUrls.splice(i, 1);
  }

  onPhotoChange(e: Event) {
    const f = (e.target as HTMLInputElement).files;
    if (f?.length) this.mainPhoto = f[0];
  }

  onDirPhotoChange(e: Event) {
    const f = (e.target as HTMLInputElement).files;
    if (f?.length) this.dirPhoto = f[0];
  }

  onServiceFileChange(e: Event, i: number) {
    const f = (e.target as HTMLInputElement).files;
    if (f?.length) this.serviceFiles[i] = f[0];
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    this.loading = true;
    const formData = new FormData();

    Object.entries(this.form.value).forEach(([key, value]) => {
      if (key !== 'activities' && key !== 'services' && value != null) {
        formData.append(key, String(value));
      }
    });

    if (this.mainPhoto) formData.append('PhotoUrl', this.mainPhoto);
    if (this.dirPhoto) formData.append('DirPhotoUrl', this.dirPhoto);

    this.activities.controls.forEach((c, i) => {
      formData.append(`Activities[${i}].ActivityAr`, c.value.activityAr || '');
      formData.append(`Activities[${i}].ActivityEn`, c.value.activityEn || '');
    });

    this.services.controls.forEach((c, i) => {
      const v = c.value;
      formData.append(`Services[${i}].ServiceAr`, v.serviceAr);
      formData.append(`Services[${i}].ServiceEn`, v.serviceEn);
      formData.append(`Services[${i}].DescriptionAr`, v.descriptionAr || '');
      formData.append(`Services[${i}].DescriptionEn`, v.descriptionEn || '');
      formData.append(`Services[${i}].Fees`, v.fees?.toString() || '0');
      formData.append(`Services[${i}].PlaceAr`, v.placeAr || '');
      formData.append(`Services[${i}].PlaceEn`, v.placeEn || '');

      if (this.serviceFiles[i]) {
        formData.append(`Services[${i}].File`, this.serviceFiles[i]);
      }
    });

    this.directorateService.updateDirectorate(this.data.id, formData).subscribe({
      next: () => {
        this.toast.success('TOAST.UPDATE_SUCCESS');
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
        this.toast.error('TOAST.UPDATE_FAIL');
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}