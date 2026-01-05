import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../Services/company.service';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { Company } from '../../Models/company';

@Component({
  selector: 'app-company-delete',
  templateUrl: './company-delete.component.html',
  styleUrls: ['../create/company-create.component.scss']
})
export class CompanyDeleteComponent {

loading = false;

  constructor(
    private service: CompanyService,
    private dialogRef: MatDialogRef<CompanyDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public company: Company,
    public i18n: I18nService
  ) {}

  confirm(): void {
    this.loading = true;

    this.service.deleteCompany(this.company.id).subscribe({
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
