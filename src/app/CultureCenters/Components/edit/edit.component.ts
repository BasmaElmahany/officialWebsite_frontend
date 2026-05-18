import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CenterService } from '../../Services/center.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CultureCenter, CultureCenterRead } from '../../Models/Center';
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
  center!: CultureCenterRead;

  photoUrl?: string;
  dirPhotoUrl?: string;
  serviceFileUrls: string[] = [];
  
  // files
  mainPhoto?: File;
  dirPhoto?: File;
  serviceFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private centerService: CenterService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public i18n: I18nService, 
    private toast: ToastService
  ) {
    // بناء النموذج الأساسي
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

  ngOnInit(): void {
    this.loadSociety();
  }

  loadSociety(): void {
    this.centerService.getById(this.data.id).subscribe({
      next: (d: CultureCenterRead) => {
        this.center = d;
        this.patchData(d);
      },
      error: () => {
        this.toast.error('TOAST.OPERATION_FAILED');
        this.dialogRef.close(false);
      }
    });
  }

  /* ================= GETTERS ================= */
  get activities(): FormArray {
    return this.form.get('activities') as FormArray;
  }

  get services(): FormArray {
    return this.form.get('services') as FormArray;
  }

  /* ================= PATCH OLD DATA ================= */
  patchData(d: CultureCenterRead): void {
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

    // الصور الأساسية
    const baseUrl = 'https://shusha.minya.gov.eg:93';
    this.photoUrl = d.photoUrl ? `${baseUrl}${d.photoUrl}` : undefined;
    this.dirPhotoUrl = (d as any).dirphotoUrl ? `${baseUrl}${(d as any).dirphotoUrl}` : undefined;

    // Activities
    d.activities?.forEach((a: any) => {
      this.activities.push(
        this.fb.group({
          activityAr: [a.activityAr, Validators.required],
          activityEn: [a.activityEn, Validators.required]
        })
      );
    });

    // Services (تم تحديثها لإضافة الحقول الجديدة وتجنب خطأ الكونسول)
    d.services?.forEach((s: any) => {
      this.services.push(
        this.fb.group({
          serviceAr: [s.serviceAr, Validators.required],
          serviceEn: [s.serviceEn, Validators.required],
          descriptionAr: [s.descriptionAr || ''],
          descriptionEn: [s.descriptionEn || ''],
          fees: [s.fees || 0],
          placeAr: [s.placeAr || ''],
          placeEn: [s.placeEn || ''],
          link: [s.link || '']
        })
      );

      this.serviceFileUrls.push(s.file ? `${baseUrl}${s.file}` : '');
    });
  }

  /* ================= ADD / REMOVE ================= */
  addActivity() {
    this.activities.push(
      this.fb.group({
        activityAr: ['', Validators.required],
        activityEn: ['', Validators.required]
      })
    );
  }

  removeActivity(i: number) {
    this.activities.removeAt(i);
  }

  addService() {
    this.services.push(
      this.fb.group({
        serviceAr: ['', Validators.required],
        serviceEn: ['', Validators.required],
        descriptionAr: [''],
        descriptionEn: [''],
        fees: [0],
        placeAr: [''],
        placeEn: [''],
        link: ['']
      })
    );
  }

  removeService(i: number) {
    this.services.removeAt(i);
    this.serviceFileUrls.splice(i, 1);
    this.serviceFiles.splice(i, 1);
  }

  /* ================= FILE HANDLERS ================= */
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

  /* ================= SUBMIT ================= */
  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const formData = new FormData();

    // Basic Info
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (key !== 'activities' && key !== 'services' && value != null) {
        formData.append(key, String(value));
      }
    });

    // Images
    if (this.mainPhoto) formData.append('PhotoUrl', this.mainPhoto);
    if (this.dirPhoto) formData.append('DirPhotoUrl', this.dirPhoto);

    // Activities
    this.activities.controls.forEach((c, i) => {
      formData.append(`Activities[${i}].ActivityAr`, c.value.activityAr);
      formData.append(`Activities[${i}].ActivityEn`, c.value.activityEn);
    });

    // Services (إرسال كافة الحقول الجديدة للسيرفر)
    this.services.controls.forEach((c, i) => {
      const v = c.value;
      formData.append(`Services[${i}].ServiceAr`, v.serviceAr);
      formData.append(`Services[${i}].ServiceEn`, v.serviceEn);
      formData.append(`Services[${i}].DescriptionAr`, v.descriptionAr);
      formData.append(`Services[${i}].DescriptionEn`, v.descriptionEn);
      formData.append(`Services[${i}].Fees`, String(v.fees));
      formData.append(`Services[${i}].PlaceAr`, v.placeAr);
      formData.append(`Services[${i}].PlaceEn`, v.placeEn);
      formData.append(`Services[${i}].Link`, v.link);

      if (this.serviceFiles[i]) {
        formData.append(`Services[${i}].File`, this.serviceFiles[i]);
      }
    });

    this.centerService.update(this.center.id, formData).subscribe({
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