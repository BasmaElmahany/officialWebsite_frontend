import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../Services/company.service';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-company-delete',
  templateUrl: './company-delete.component.html',
  styleUrls: ['./company-delete.component.scss']
})
export class CompanyDeleteComponent {
  loading = false;
  error = '';

  constructor(
    private companyService: CompanyService,
    private dialogRef: MatDialogRef<CompanyDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string; nameAr: string; nameEn: string },
    public i18n: I18nService
  ) {}

  confirmDelete(): void {
    this.loading = true;
    this.companyService.deleteCompany(this.data.id).subscribe({
      next: (res) => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete company.';
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
