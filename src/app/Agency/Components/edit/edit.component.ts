import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgencyRead } from '../../Models/agency';
import { AgncyService } from '../../Services/agncy.service';
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
  agency!: AgencyRead;

  photoUrl?: string;
  dirPhotoUrl?: string;
  serviceFileUrls: string[] = [];
  
  mainPhoto?: File;
  dirPhoto?: File;
  serviceFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private agencyService: AgncyService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
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

  ngOnInit(): void {
    this.loadDirectorate();
  }

  loadDirectorate(): void {
    this.agencyService.getbyId(this.data.id).subscribe({
      next: (d: AgencyRead) => {
        this.agency = d;
        this.patchData(d);
      },
      error: () => {
        this.toast.error('TOAST.OPERATION_FAILED');
        this.dialogRef.close(false);
      }
    });
  }

  get activities(): FormArray { return this.form.get('activities') as FormArray; }
  get services(): FormArray { return this.form.get('services') as FormArray; }

  patchData(d: AgencyRead): void {
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

    this.photoUrl = d.photoUrl ? `https://shusha.minya.gov.eg:93${d.photoUrl}` : undefined;
    const rawData = d as any;
    this.dirPhotoUrl = (rawData.dirphotoUrl || rawData.dirPhotoUrl) 
      ? `https://shusha.minya.gov.eg:93${rawData.dirphotoUrl || rawData.dirPhotoUrl}` 
      : undefined;

    d.activities?.forEach(a => {
      this.activities.push(this.fb.group({
        activityAr: [a.activityAr, Validators.required],
        activityEn: [a.activityEn, Validators.required]
      }));
    });

    d.services?.forEach((s: any, index: number) => {
      this.services.push(this.fb.group({
        id: [s.id || 0],
        serviceAr: [s.serviceAr, Validators.required],
        serviceEn: [s.serviceEn, Validators.required],
        descriptionAr: [s.descriptionAr || ''],
        descriptionEn: [s.descriptionEn || ''],
        fees: [s.fees || 0],
        placeAr: [s.placeAr || ''],
        placeEn: [s.placeEn || ''],
        link: [s.link || '']
      }));
      this.serviceFileUrls[index] = s.file ? `https://shusha.minya.gov.eg:93${s.file}` : '';
    });
  }

  addService() {
    this.services.push(this.fb.group({
      id: [0],
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

  addActivity() {
    this.activities.push(this.fb.group({
      activityAr: ['', Validators.required],
      activityEn: ['', Validators.required]
    }));
  }

  removeActivity(i: number) { this.activities.removeAt(i); }

  removeService(i: number) {
    this.services.removeAt(i);
    this.serviceFileUrls.splice(i, 1);
    this.serviceFiles.splice(i, 1);
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
      return;
    }

    this.loading = true;
    const formData = new FormData();
    const val = this.form.value;

    formData.append('Id', this.agency.id);
    formData.append('NameAr', val.nameAr);
    formData.append('NameEn', val.nameEn);
    formData.append('DirNameAr', val.dirNameAr || '');
    formData.append('DirNameEn', val.dirNameEn || '');
    formData.append('AddressAr', val.addressAr || '');
    formData.append('AddressEn', val.addressEn || '');
    formData.append('PhoneNumber1', val.phoneNumber1 || '');
    formData.append('PhoneNumber2', val.phoneNumber2 || '');
    formData.append('Email', val.email || '');
    formData.append('FaxNumber', val.faxNumber || '');
    formData.append('Link', val.link || '');

    if (this.mainPhoto) formData.append('PhotoUrl', this.mainPhoto);
    if (this.dirPhoto) formData.append('DirPhotoUrl', this.dirPhoto);

    val.activities.forEach((a: any, i: number) => {
      formData.append(`Activities[${i}].ActivityAr`, a.activityAr);
      formData.append(`Activities[${i}].ActivityEn`, a.activityEn);
    });

    val.services.forEach((s: any, i: number) => {
      formData.append(`Services[${i}].Id`, s.id.toString());
      formData.append(`Services[${i}].AgencyId`, this.agency.id);
      formData.append(`Services[${i}].ServiceAr`, s.serviceAr);
      formData.append(`Services[${i}].ServiceEn`, s.serviceEn);
      formData.append(`Services[${i}].DescriptionAr`, s.descriptionAr || '');
      formData.append(`Services[${i}].DescriptionEn`, s.descriptionEn || '');
      formData.append(`Services[${i}].Fees`, (s.fees || 0).toString());
      formData.append(`Services[${i}].PlaceAr`, s.placeAr || '');
      formData.append(`Services[${i}].PlaceEn`, s.placeEn || '');
      formData.append(`Services[${i}].Link`, s.link || '');

      if (this.serviceFiles[i]) {
        formData.append(`Services[${i}].File`, this.serviceFiles[i], this.serviceFiles[i].name);
      }
    });

    this.agencyService.updateAgency(this.agency.id, formData).subscribe({
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