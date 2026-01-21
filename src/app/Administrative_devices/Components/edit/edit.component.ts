import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministrativeDevicesService } from '../../Services/administrative-devices.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdministrativeDevice, AdministrativeDeviceRead } from '../../Models/AdministrativeDevice';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { ToastService } from '../../../Shared/Services/toast/toast.service';

@Component({
  selector: 'app-administrative-devices-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  form: FormGroup;
  loading = false;
  device!: AdministrativeDeviceRead;
  photoUrl?: string;
  mainPhoto?: File;

  constructor(
    private fb: FormBuilder,
    private adminDevicesService: AdministrativeDevicesService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public i18n: I18nService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      serialNumber: [''],
      type: [''],
      status: [''],
      location: [''],
      purchaseDate: [''],
      warrantyEndDate: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadDevice();
  }

  loadDevice(): void {
    this.adminDevicesService.getById(this.data.id).subscribe({
      next: (d: AdministrativeDeviceRead) => {
        this.device = d;
        this.patchData(d);
      },
      error: () => {
        this.toast.error('حدث خطأ أثناء تحميل البيانات');
        this.dialogRef.close(false);
      }
    });
  }

  patchData(d: AdministrativeDeviceRead): void {
    this.form.patchValue({
      nameAr: d.nameAr,
      nameEn: d.nameEn,
      serialNumber: d.serialNumber,
      type: d.type,
      status: d.status,
      location: d.location,
      purchaseDate: d.purchaseDate,
      warrantyEndDate: d.warrantyEndDate,
      notes: d.notes
    });
    this.photoUrl = d.photoUrl ? d.photoUrl : undefined;
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.mainPhoto = input.files[0];
    }
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, String(value));
      }
    });
    if (this.mainPhoto) formData.append('PhotoUrl', this.mainPhoto);
    this.adminDevicesService.update(this.device.id, formData).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('تم تحديث الجهاز الإداري بنجاح');
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
        this.toast.error('حدث خطأ أثناء التحديث');
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
