import { Component, Inject, OnInit } from '@angular/core';
import { AgncyService } from '../../Services/agncy.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { Agency } from '../../Models/agency';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  loading = true;
  agency?: Agency;
  readonly baseUrl = 'https://shusha.minya.gov.eg:93';

  constructor(
    private agencyService: AgncyService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Agency,
    public i18n: I18nService
  ) {
    const id = (data as any)?.id;

    if (!id) {
      this.agency = data;
      this.loading = false;
      return;
    }

    this.agencyService.getbyId(id).subscribe({
      next: (res) => {
        console.log('API Response:', res);
        this.agency = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching details:', err);
        this.agency = this.data; // Fallback
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    // اللوج هنا ممكن يظهر undefined لو الـ API لسه مخلصش، عادي.
  }

  close(): void {
    this.dialogRef.close(false);
  }

  /**
   * دالة عامة لمعالجة روابط الصور والملفات
   */
  private formatUrl(path?: string | { fileName: string }): string {
    if (!path) return '';
    
    const fileName = typeof path === 'string' ? path : path.fileName;
    
    if (!fileName) return '';
    if (fileName.startsWith('http')) return fileName;
    
    // تأكد أن المسار يبدأ بـ /
    const cleanPath = fileName.startsWith('/') ? fileName : '/' + fileName;
    return `${this.baseUrl}${cleanPath}`;
  }

  getPhotoUrl(photoData?: any): string {
    return this.formatUrl(photoData);
  }

  getDirPhotoUrl(dirPhotoData?: any): string {
    return this.formatUrl(dirPhotoData);
  }

  // الميثود دي مهمة جداً عشان الـ HTML الجديد اللي بعتهولك
  getServiceFileUrl(fileUrl?: any): string {
    return this.formatUrl(fileUrl);
  }
}