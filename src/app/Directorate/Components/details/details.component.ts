import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { DirectorateRead } from '../../Models/directorate';
import { DirectorateService } from '../../Services/directorate.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  loading = true;
  directorate?: DirectorateRead;

  constructor(
    private directorateService: DirectorateService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }, // نتوقع استقبال الـ ID فقط لجلب البيانات الطازجة
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.loadDetails();
  }

  /**
   * جلب تفاصيل المديرية بالكامل لضمان ظهور كافة الحقول (الخدمات، الرسوم، إلخ)
   */
  loadDetails(): void {
    this.loading = true;
    this.directorateService.getbyId(this.data.id).subscribe({
      next: (res) => {
        // معالجة البيانات القادمة لضمان مطابقة أسماء الحقول
        const raw = res as any;
        res.dirPhotoUrl = raw.dirPhotoUrl ?? raw.dirphotoUrl;
        
        this.directorate = res;
        this.loading = false;
        console.log('Final Details Data:', this.directorate);
      },
      error: (err) => {
        console.error('Error loading details:', err);
        this.loading = false;
        this.dialogRef.close();
      }
    });
  }

  /**
   * دالة موحدة لجلب الروابط الكاملة للصور والملفات (PDF)
   */
  getPhotoUrl(path?: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    // تأكد من استخدام الـ Base URL الصحيح الخاص بسيرفر المنيا
    const baseUrl = 'https://shusha.minya.gov.eg:93';
    return `${baseUrl}${path}`;
  }

  /**
   * رابط صورة المدير (تستخدم نفس منطق الصور العام)
   */
  getDirPhotoUrl(path?: string): string {
    return this.getPhotoUrl(path);
  }

  close(): void {
    this.dialogRef.close(false);
  }
}