import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../Services/company.service';
import { Company, CreateCompany } from '../../Models/company';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent {
    loading = false;
  form = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required]
    });
  
    constructor(
      private fb: FormBuilder,
      private companyService: CompanyService,
      private dialogRef: MatDialogRef<CompanyEditComponent>,
      @Inject(MAT_DIALOG_DATA) public company: Company,
      public i18n: I18nService
    ) {
      this.form.patchValue({
        nameAr: company.nameAr ?? '',
        nameEn: company.nameEn ?? ''
      });
    }
  
    submit(): void {
      if (this.form.invalid || this.loading) return;
  
      this.loading = true;
  
      const payload: CreateCompany = {
        nameAr: this.form.get('nameAr')!.value!,
        nameEn: this.form.get('nameEn')!.value!
      };
  
      this.companyService.updateCompany(this.company .id, payload).subscribe({
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
