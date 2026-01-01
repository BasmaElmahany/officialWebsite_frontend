import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../Services/company.service';
import { CompanyRead } from '../../Models/company';
import { MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['./company-create.component.scss']
})

export class CompanyCreateComponent {
  form: FormGroup;
  loading = false;
  activities = this.fb.array<FormGroup>([]);
  services = this.fb.array<FormGroup>([]);

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private dialogRef: MatDialogRef<CompanyCreateComponent>,
    public i18n: I18nService
  ) {
    this.form = this.fb.group({
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
      activities: this.activities,
      services: this.services
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const formData = new FormData();
    formData.append('nameAr', this.form.get('nameAr')!.value!);
    formData.append('nameEn', this.form.get('nameEn')!.value!);

    this.companyService.createCompany(formData).subscribe({
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
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.form.patchValue({ photo: file });
    }
  }

  onDirPhotoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.form.patchValue({ dirPhoto: file });
    }
  }

  addActivity(): void {
    this.activities.push(
      this.fb.group({
        activityAr: this.fb.control(''),
        activityEn: this.fb.control('')
      })
    );
  }

  removeActivity(index: number): void {
    this.activities.removeAt(index);
  }

  addService(): void {
    this.services.push(
      this.fb.group({
        serviceAr: this.fb.control(''),
        serviceEn: this.fb.control(''),
        file: this.fb.control(null)
      })
    );
  }

  removeService(index: number): void {
    this.services.removeAt(index);
  }

  onServiceFileChange(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.services.at(index).patchValue({ file });
    }
  }
}
