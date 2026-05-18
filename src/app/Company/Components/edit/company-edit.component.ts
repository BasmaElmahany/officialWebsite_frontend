import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../Services/company.service';
import { CompanyRead } from '../../Models/company';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { ToastService } from '../../../Shared/Services/toast/toast.service';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {
  form: FormGroup;
  loading = false;
  company!: CompanyRead;
  readonly baseUrl = 'https://shusha.minya.gov.eg:93';

  // للمعاينة في الـ UI
  photoUrl?: string;
  dirPhotoUrl?: string;
  serviceFileUrls: string[] = [];

  // الملفات الفعلية للرفع
  mainPhoto?: File;
  dirPhoto?: File;
  serviceFiles: { [key: number]: File } = {}; // استخدمنا Object عشان الـ index يفضل ثابت

  constructor(
    private fb: FormBuilder,
    private service: CompanyService,
    private dialogRef: MatDialogRef<CompanyEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public i18n: I18nService, 
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      id: [null],
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
    this.loadCompany();
  }

  loadCompany(): void {
    this.service.getbyId(this.data.id).subscribe({
      next: d => {
        this.company = d;
        this.patchData(d);
      },
      error: () => {
        this.toast.error('TOAST.OPERATION_FAILED');
        this.dialogRef.close(false);
      }
    });
  }

  get activities() { return this.form.get('activities') as FormArray; }
  get services() { return this.form.get('services') as FormArray; }

  patchData(d: CompanyRead): void {
    this.form.patchValue(d);

    // الصور الأساسية
    this.photoUrl = d.photoUrl ? this.formatUrl(d.photoUrl) : undefined;
    const raw = d as any;
    this.dirPhotoUrl = (raw.dirPhotoUrl || raw.dirphotoUrl) ? this.formatUrl(raw.dirPhotoUrl || raw.dirphotoUrl) : undefined;

    // الأنشطة
    d.activities?.forEach(a => {
      this.activities.push(this.fb.group({
        activityAr: [a.activityAr, Validators.required],
        activityEn: [a.activityEn, Validators.required]
      }));
    });

    // الخدمات (بإضافة الحقول الجديدة)
    d.services?.forEach((s: any, i: number) => {
      this.services.push(this.fb.group({
        serviceAr: [s.serviceAr, Validators.required],
        serviceEn: [s.serviceEn, Validators.required],
        descriptionAr: [s.descriptionAr],
        descriptionEn: [s.descriptionEn],
        fees: [s.fees || 0],
        placeAr: [s.placeAr],
        placeEn: [s.placeEn],
        link: [s.link]
      }));

      this.serviceFileUrls[i] = s.fileUrl ? this.formatUrl(s.fileUrl) : '';
    });
  }

  /* ================= ADD / REMOVE ================= */
  addActivity() {
    this.activities.push(this.fb.group({
      activityAr: ['', Validators.required],
      activityEn: ['', Validators.required]
    }));
  }

  removeActivity(i: number) { this.activities.removeAt(i); }

  addService() {
    this.services.push(this.fb.group({
      serviceAr: ['', Validators.required],
      serviceEn: ['', Validators.required],
      descriptionAr: [''],
      descriptionEn: [''],
      fees: [0],
      placeAr: [''],
      placeEn: [''],
      link: ['']
    }));
  }

  removeService(i: number) {
    this.services.removeAt(i);
    this.serviceFileUrls.splice(i, 1);
    delete this.serviceFiles[i];
  }

  /* ================= FILE HANDLERS ================= */
  onPhotoChange(e: any) {
    const file = e.target.files[0];
    if (file) {
      this.mainPhoto = file;
      const reader = new FileReader();
      reader.onload = (res: any) => this.photoUrl = res.target.result;
      reader.readAsDataURL(file);
    }
  }

  onDirPhotoChange(e: any) {
    const file = e.target.files[0];
    if (file) {
      this.dirPhoto = file;
      const reader = new FileReader();
      reader.onload = (res: any) => this.dirPhotoUrl = res.target.result;
      reader.readAsDataURL(file);
    }
  }

  onServiceFileChange(e: any, i: number) {
    const file = e.target.files[0];
    if (file) this.serviceFiles[i] = file;
  }

  /* ================= SUBMIT ================= */
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = new FormData();
    const values = this.form.getRawValue();

    // 1. Basic Fields
    Object.entries(values).forEach(([key, value]) => {
      if (key !== 'activities' && key !== 'services' && value != null) {
        formData.append(key, String(value));
      }
    });

    // 2. Main Photos
    if (this.mainPhoto) formData.append('PhotoUrl', this.mainPhoto);
    if (this.dirPhoto) formData.append('DirPhotoUrl', this.dirPhoto);

    // 3. Activities
    values.activities.forEach((act: any, i: number) => {
      formData.append(`Activities[${i}].ActivityAr`, act.activityAr);
      formData.append(`Activities[${i}].ActivityEn`, act.activityEn);
    });

    // 4. Services
    values.services.forEach((ser: any, i: number) => {
      Object.keys(ser).forEach(key => {
        const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
        formData.append(`Services[${i}].${fieldName}`, ser[key]);
      });

      if (this.serviceFiles[i]) {
        formData.append(`Services[${i}].File`, this.serviceFiles[i]);
      }
    });

    this.service.updateCompany(this.company.id, formData).subscribe({
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

  formatUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  close(): void { this.dialogRef.close(false); }
}