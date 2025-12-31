import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DirectorateService } from '../../Services/directorate.service';
import { MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-create',

  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  form: FormGroup;
  loading = false;

  // store files outside the form
  mainPhoto?: File;
  dirPhoto?: File;
  serviceFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private directorateService: DirectorateService,
    private dialogRef: MatDialogRef<CreateComponent>,
    public i18n: I18nService
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
      link : [''],
      activities: this.fb.array([]),
      services: this.fb.array([])
    });
  }

  /* =====================================================
     GETTERS
  ===================================================== */
  get activities(): FormArray {
    return this.form.get('activities') as FormArray;
  }
  get services(): FormArray {
    return this.form.get('services') as FormArray;
  }

  /* =====================================================
     ACTIVITIES
  ===================================================== */
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

  /* =====================================================
     SERVICES
  ===================================================== */
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

  /* =====================================================
     FILE HANDLERS
  ===================================================== */
  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.mainPhoto = input.files[0];
    }
  }

  onDirPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.dirPhoto = input.files[0];
    }
  }

  onServiceFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.serviceFiles[index] = input.files[0];
    }
  }

  /* =====================================================
     SUBMIT
  ===================================================== */
  submit(): void {
    if (this.form.invalid || this.activities.invalid || this.services.invalid) {
      this.form.markAllAsTouched();
      this.activities.markAllAsTouched();
      this.services.markAllAsTouched();
      return;
    }
    this.loading = true;

    const formData = new FormData();

    // ===== basic fields =====
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (key !== 'activities' && key !== 'services' && value != null) {
        formData.append(key, String(value));
      }
    });

    // ===== images =====
    if (this.mainPhoto) {
      formData.append('PhotoUrl', this.mainPhoto);
    }

    if (this.dirPhoto) {
      formData.append('DirPhotoUrl', this.dirPhoto);
    }

    // ===== activities =====
    this.activities.controls.forEach((ctrl, i) => {
      const { activityAr, activityEn } = ctrl.value;

      if (activityAr && activityEn) {
        formData.append(`Activities[${i}].ActivityAr`, activityAr);
        formData.append(`Activities[${i}].ActivityEn`, activityEn);
      }
    });

    // ===== services =====
    this.services.controls.forEach((ctrl, i) => {
      const { serviceAr, serviceEn } = ctrl.value;

      if (serviceAr && serviceEn) {
        formData.append(`Services[${i}].ServiceAr`, serviceAr);
        formData.append(`Services[${i}].ServiceEn`, serviceEn);

        if (this.serviceFiles[i]) {
          formData.append(`Services[${i}].File`, this.serviceFiles[i]);
        }
      }
    });
    console.group('📦 Directorate FormData Payload');

    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(key, {
          fileName: value.name,
          fileType: value.type,
          fileSize: value.size
        });
      } else {
        console.log(key, value);
      }
    });

    console.groupEnd();

    this.directorateService.createDirectorate(formData).subscribe({
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
}
