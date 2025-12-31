import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DirectorateService } from '../../Services/directorate.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Directorate } from '../../Models/directorate';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  form: FormGroup;
  loading = false;

  // files
  mainPhoto?: File;
  dirPhoto?: File;
  serviceFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private directorateService: DirectorateService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public directorate: Directorate,
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

    this.patchData();
  }

  /* ================= GETTERS ================= */
  get activities(): FormArray {
    return this.form.get('activities') as FormArray;
  }

  get services(): FormArray {
    return this.form.get('services') as FormArray;
  }

  /* ================= PATCH OLD DATA ================= */
  patchData(): void {
    this.form.patchValue({
      nameAr: this.directorate.nameAr,
      nameEn: this.directorate.nameEn,
      dirNameAr: this.directorate.dirNameAr,
      dirNameEn: this.directorate.dirNameEn,
      addressAr: this.directorate.addressAr,
      addressEn: this.directorate.addressEn,
      phoneNumber1: this.directorate.phoneNumber1,
      phoneNumber2: this.directorate.phoneNumber2,
      email: this.directorate.email,
      faxNumber: this.directorate.faxNumber,
      link: this.directorate.link
    });

    // activities
    this.directorate.activities?.forEach(a => {
      this.activities.push(
        this.fb.group({
          activityAr: [a.activityAr, Validators.required],
          activityEn: [a.activityEn, Validators.required]
        })
      );
    });

    // services
    this.directorate.services?.forEach(() => {
      this.services.push(
        this.fb.group({
          serviceAr: ['', Validators.required],
          serviceEn: ['', Validators.required]
        })
      );
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
        serviceEn: ['', Validators.required]
      })
    );
  }

  removeService(i: number) {
    this.services.removeAt(i);
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = new FormData();

    // basic
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (key !== 'activities' && key !== 'services' && value != null) {
        formData.append(key, String(value));
      }
    });

    // images
    if (this.mainPhoto) formData.append('PhotoUrl', this.mainPhoto);
    if (this.dirPhoto) formData.append('DirPhotoUrl', this.dirPhoto);

    // activities
    this.activities.controls.forEach((c, i) => {
      const { activityAr, activityEn } = c.value;
      formData.append(`Activities[${i}].ActivityAr`, activityAr);
      formData.append(`Activities[${i}].ActivityEn`, activityEn);
    });

    // services
    this.services.controls.forEach((c, i) => {
      const { serviceAr, serviceEn } = c.value;
      formData.append(`Services[${i}].ServiceAr`, serviceAr);
      formData.append(`Services[${i}].ServiceEn`, serviceEn);

      if (this.serviceFiles[i]) {
        formData.append(`Services[${i}].File`, this.serviceFiles[i]);
      }
    });

    this.directorateService
      .updateDirectorate(this.directorate.id, formData)
      .subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => (this.loading = false)
      });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
