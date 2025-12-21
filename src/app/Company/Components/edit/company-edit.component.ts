import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../Services/company.service';
import { Company } from '../../Models/company';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private dialogRef: MatDialogRef<CompanyEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Company,
    public i18n: I18nService
  ) {
    this.form = this.fb.group({
      nameAr: [data.nameAr, Validators.required],
      nameEn: [data.nameEn, Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const payload: Company = { ...this.data, ...this.form.value };
    this.companyService.updateCompany(payload).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: () => this.loading = false
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
