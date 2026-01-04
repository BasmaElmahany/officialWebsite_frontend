import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../Services/company.service';
import { CompanyRead } from '../../Models/company';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
  company?: CompanyRead;
  loading = true;
  error = '';

  constructor(
    private companyService: CompanyService,
    private dialogRef: MatDialogRef<CompanyDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyRead,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    // If all data is present, use it directly, else fallback to API
    if (this.data && this.data.nameAr && this.data.nameEn) {
      this.company = this.data;
      this.loading = false;
    } else if (this.data && this.data.id) {
      this.companyService.getCompanyById(this.data.id).subscribe({
        next: (company) => {
          this.company = company;
          this.loading = false;
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to load company details.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No company data available.';
      this.loading = false;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
