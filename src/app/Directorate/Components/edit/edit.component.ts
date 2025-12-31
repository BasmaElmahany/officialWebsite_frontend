import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DirectorateService } from '../../Services/directorate.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Directorate, DirectorateRead } from '../../Models/directorate';
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
  // files
  mainPhoto?: File;
  dirPhoto?: File;
  serviceFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private directorateService: DirectorateService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public i18n: I18nService, private toast: ToastService
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
  /* ================= GETTERS ================= */
  get activities(): FormArray {
    return this.form.get('activities') as FormArray;
  }

  get services(): FormArray {
    return this.form.get('services') as FormArray;
  }

  /* ================= PATCH OLD DATA ================= */
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

    // images URLs
    this.photoUrl = d.photoUrl
      ? `https://shusha.minya.gov.eg:93${d.photoUrl}`
      : undefined;

    this.dirPhotoUrl = d.dirphotoUrl
      ? `https://shusha.minya.gov.eg:93${d.dirphotoUrl}`
      : undefined;

    // activities
    d.activities?.forEach(a => {
      this.activities.push(
        this.fb.group({
          activityAr: [a.activityAr, Validators.required],
          activityEn: [a.activityEn, Validators.required]
        })
      );
    });

    // services
    d.services?.forEach(s => {
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
      // this.form.markAllAsTouched();
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
          this.loading = true;
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
