import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { CultureCenter } from '../../Models/Center';
import { CenterService } from '../../Services/center.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  loading = true;
  center?: CultureCenter;

  constructor(
    private centerService: CenterService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    const id = this.data?.id;
    if (!id) {
      this.loading = false;
      return;
    }

    this.centerService.getById(id).subscribe({
      next: (res: CultureCenter) => {
        // نضمن أن كائن الـ center يحتوي على كل الحقول الجديدة القادمة من الـ API
        this.center = {
          ...res,
          // معالجة مشكلة الـ Case sensitivity في رابط صورة المدير
          dirPhotoUrl: (res as any).dirphotoUrl || (res as any).dirPhotoUrl,
          // نضمن أن المصفوفات موجودة حتى لو كانت فارغة لتجنب أخطاء الـ *ngFor
          services: res.services || [],
          activities: res.activities || []
        };
        
        console.log('Center Details Loaded:', this.center);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching details:', err);
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  /**
   * تنسيق روابط الصور والملفات
   * سيعمل هذا مع الصور الشخصية وأيضاً مع ملفات الـ PDF الخاصة بالخدمات
   */
  formatImageUrl(url?: string): string {
    if (!url) return 'assets/images/default-placeholder.png';
    if (url.startsWith('http')) return url;
    
    // تأكد من وجود الـ Base URL الصحيح للملفات
    const baseUrl = 'https://shusha.minya.gov.eg:93';
    const separator = url.startsWith('/') ? '' : '/';
    
    return `${baseUrl}${separator}${url}`;
  }
}