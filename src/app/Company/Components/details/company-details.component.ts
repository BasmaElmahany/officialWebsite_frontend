import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { CompanyRead } from '../../Models/company';
import { CompanyService } from '../../Services/company.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent {
  loading = true;
  company?: CompanyRead;

  constructor(
    private companyService: CompanyService,
    private dialogRef: MatDialogRef<CompanyDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyRead,
    public i18n: I18nService
  ) {
    const id = (data as any)?.id;

    if (!id) {
      this.loading = false;
      this.company = data;
      return;
    }

    this.companyService.getCompanyById(id).subscribe({
      next: (c: CompanyRead) => {
        this.company = c;
        const raw = c as any;

        c.dirPhotoUrl = this.getDirPhotoUrl(
          raw.dirPhotoUrl ?? raw.dirphotoUrl
        );

        // Ensure files are processed if available
        if (c.files) {
          c.files = c.files.map(file => ({
            ...file,
            fileUrl: this.getPhotoUrl(file.fileUrl)
          }));
        }

        this.loading = false;
      },
      error: () => {
        this.company = this.data;
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  getPhotoUrl(photoData?: string | { fileName: string }): string {
    if (!photoData) return '';
    if (typeof photoData === 'string') {
      if (photoData.startsWith('http')) return photoData;
      return 'https://shusha.minya.gov.eg:93' + photoData;
    }
    return `https://shusha.minya.gov.eg:93${photoData.fileName}`;
  }

  getDirPhotoUrl(dirphotoUrl?: string | { fileName: string }): string {
    if (!dirphotoUrl) return '';
    if (typeof dirphotoUrl === 'string') {
      if (dirphotoUrl.startsWith('http')) return dirphotoUrl;
      return 'https://shusha.minya.gov.eg:93' + dirphotoUrl;
    }
    return `https://shusha.minya.gov.eg:93${dirphotoUrl.fileName}`;
  }
}