import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { Company } from '../../Models/company';
import { CompanyService } from '../../Services/company.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
  loading = true;
  company?: any; // تم استخدام any أو CompanyRead لضمان قراءة الحقول الجديدة
  readonly baseUrl = 'https://shusha.minya.gov.eg:93';

  constructor(
    private companyService: CompanyService,
    private dialogRef: MatDialogRef<CompanyDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Company,
    public i18n: I18nService
  ) { }

  ngOnInit() {
    this.loadCompanyDetails();
  }

  loadCompanyDetails() {
    const id = (this.data as any)?.id;

    if (!id) {
      this.company = this.data;
      this.loading = false;
      return;
    }

    this.companyService.getbyId(id).subscribe({
      next: (c) => {
        this.company = c;
        this.loading = false;
        console.log('Detailed Company Data:', this.company);
      },
      error: (err) => {
        console.error('Error fetching details:', err);
        this.company = this.data; // Fallback
        this.loading = false;
      }
    });
  }

  /**
   * دالة موحدة لمعالجة الروابط (صور، ملفات PDF، إلخ)
   */
  getFormatUrl(path?: string | { fileName: string }): string {
    if (!path) return '';
    
    // إذا كان الكائن يحتوي على fileName
    const fileName = typeof path === 'object' ? path.fileName : path;

    if (fileName.startsWith('http')) return fileName;
    
    // التأكد من وجود / في البداية
    const normalizedPath = fileName.startsWith('/') ? fileName : `/${fileName}`;
    return `${this.baseUrl}${normalizedPath}`;
  }

  // دوال مساعدة لسهولة الاستخدام في الـ HTML
  getPhotoUrl(path: any) { return this.getFormatUrl(path); }
  getDirPhotoUrl(path: any) { return this.getFormatUrl(path); }

  close(): void {
    this.dialogRef.close(false);
  }
}