import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../Services/company.service';
import { CompanyRead } from '../../Models/company';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent {
  loading = false;
  photoUrl?: string;
  dirPhotoUrl?: string;
  serviceFileUrls: string[] = [];
  serviceFiles: File[] = [];

  form = this.fb.group({
    nameAr: ['', Validators.required],
    nameEn: ['', Validators.required],
    dirNameAr: [''],
    dirNameEn: [''],
    addressAr: [''],
    addressEn: [''],
    email: [''],
    phoneNumber1: [''],
    phoneNumber2: [''],
    faxNumber: [''],
    link: [''],
    activities: this.fb.array([]),
    services: this.fb.array([]),
    photo: [null as File | null],
    dirPhoto: [null as File | null]
  });

  get activities(): FormArray {
    return this.form.get('activities') as FormArray;
  }

  get services(): FormArray {
    return this.form.get('services') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private dialogRef: MatDialogRef<CompanyEditComponent>,
    @Inject(MAT_DIALOG_DATA) public company: CompanyRead,
    public i18n: I18nService
  ) {
    this.patchData(company);
  }

  patchData(c: CompanyRead): void {
    this.form.patchValue({
      nameAr: c.nameAr,
      nameEn: c.nameEn,
      dirNameAr: c.dirNameAr,
      dirNameEn: c.dirNameEn,
      addressAr: c.addressAr,
      addressEn: c.addressEn,
      phoneNumber1: c.phoneNumber1,
      phoneNumber2: c.phoneNumber2,
      email: c.email,
      faxNumber: c.faxNumber,
      link: c.link
    });

    // images URLs
    this.photoUrl = c.photoUrl
      ? `https://shusha.minya.gov.eg:93${c.photoUrl}`
      : undefined;
    this.dirPhotoUrl = c.dirPhotoUrl
      ? `https://shusha.minya.gov.eg:93${c.dirPhotoUrl}`
      : undefined;

    // activities
    c.activities?.forEach(a => {
      this.activities.push(
        this.fb.group({
          activityAr: [a.activityAr, Validators.required],
          activityEn: [a.activityEn, Validators.required]
        })
      );
    });

    // services
    c.services?.forEach(s => {
      this.services.push(
        this.fb.group({
          serviceAr: [s.serviceAr, Validators.required],
          serviceEn: [s.serviceEn, Validators.required]
        })
      );

      this.serviceFileUrls.push(
        s.file
          ? `https://shusha.minya.gov.eg:93${s.file}`
          : ''
      );
    });
  }

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

  addService(): void {
    this.services.push(
      this.fb.group({
        serviceAr: ['', Validators.required],
        serviceEn: ['', Validators.required]
      })
    );
  }

  removeService(index: number): void {
    this.services.removeAt(index);
    this.serviceFiles.splice(index, 1);
  }

  onServiceFileChange(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.serviceFiles[index] = file;
    }
  }

  submit(): void {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    const formData = new FormData();

    Object.entries(this.form.value).forEach(([key, value]) => {
      if (key !== 'activities' && key !== 'services' && value != null) {
        formData.append(key, value as string | Blob);
      }
    });

    if (this.form.get('photo')!.value) {
      formData.append('Photo', this.form.get('photo')!.value as Blob);
    }

    if (this.form.get('dirPhoto')!.value) {
      formData.append('DirPhotoUrl', this.form.get('dirPhoto')!.value as Blob);
    }

    this.activities.controls.forEach((control, index) => {
      const { activityAr, activityEn } = control.value;
      formData.append(`Activities[${index}].ActivityAr`, activityAr);
      formData.append(`Activities[${index}].ActivityEn`, activityEn);
    });

    this.services.controls.forEach((control, index) => {
      const { serviceAr, serviceEn } = control.value;
      formData.append(`Services[${index}].ServiceAr`, serviceAr);
      formData.append(`Services[${index}].ServiceEn`, serviceEn);

      if (this.serviceFiles[index]) {
        formData.append(`Services[${index}].File`, this.serviceFiles[index]);
      }
    });

    this.companyService.updateCompany(this.company.id, formData).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoUrl = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onDirPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.dirPhotoUrl = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  getPhotoUrl(photoData?: string | { fileName: string }): string {
    if (!photoData) return '';
    if (typeof photoData === 'string') {
      if (photoData.startsWith('http')) return photoData;
      return 'https://shusha.minya.gov.eg:93' + photoData;
    }
    return `https://shusha.minya.gov.eg:93${photoData.fileName}`;
  }

  getDirPhotoUrl(dirPhotoData?: string | { fileName: string }): string {
    if (!dirPhotoData) return '';
    if (typeof dirPhotoData === 'string') {
      if (dirPhotoData.startsWith('http')) return dirPhotoData;
      return 'https://shusha.minya.gov.eg:93' + dirPhotoData;
    }
    return `https://shusha.minya.gov.eg:93${dirPhotoData.fileName}`;
  }
}
