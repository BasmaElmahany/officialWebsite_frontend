import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../../../Shared/Services/language.service';
import { DirectoratesService } from '../../../Services/directorates/directorates.service';
import { Directorate } from '../../../Models/directorates';

@Component({
  selector: 'app-directorates-details',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './directorates-details.component.html',
  styleUrls: ['./directorates-details.component.scss']
})
export class DirectoratesDetailsComponent implements OnInit {
  id!: string;
  loading = true;
  directorate?: Directorate;
  
  // تتبع الصور المكسورة لتجنب محاولة تحميلها مرة أخرى
  private brokenImages: Set<string> = new Set();
  
  isMobile: boolean = false;
  screenWidth: number = window.innerWidth;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private service: DirectoratesService,
    public lang: LanguageService,
    private router: Router
  ) {
    const state = history.state as { id?: string };
    if (!state?.id) {
      this.router.navigate(['/directorates']);
      return;
    }
    this.id = state.id;
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.loadDirectorateDetails();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = this.screenWidth <= 768;
  }

  loadDirectorateDetails(): void {
    this.loading = true;
    this.service.getbyId(this.id).subscribe({
      next: (res: any) => {
        // استلام البيانات وتجهيزها
        const rawData = res.data ? res.data : res;

        if (rawData) {
          // حل مشكلة اختلاف أسماء الحقول بين الـ API والـ Model
          // الـ API يرسل dirphotoUrl بينما الـ Model يتوقع dirPhotoUrl
          if (rawData.dirphotoUrl && !rawData.dirPhotoUrl) {
            rawData.dirPhotoUrl = rawData.dirphotoUrl;
          }
        }

        this.directorate = rawData;
        this.loading = false;
        
        console.log('Directorate Detail Loaded:', this.directorate);
      },
      error: (error) => {
        console.error('Error loading directorate:', error);
        this.loading = false;
      }
    });
  }

  // دالة بناء رابط الصورة مع معالجة الأخطاء
  imageUrl(path: string | undefined): string {
    // إذا كان المسار فارغاً أو الصورة مكسورة سابقاً، استخدم الصورة الافتراضية
    if (!path || this.brokenImages.has(path)) {
      return 'assets/placeholder.jpg'; // تأكدي من وجود هذا الملف في src/assets/
    }
    
    let fullUrl = path;
    if (!fullUrl.startsWith('http')) {
      const baseUrl = 'https://shusha.minya.gov.eg:93';
      fullUrl = fullUrl.startsWith('/') ? `${baseUrl}${fullUrl}` : `${baseUrl}/${fullUrl}`;
    }
    
    return fullUrl;
  }

  // معالجة خطأ تحميل الصورة ديناميكياً
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    const src = imgElement.src;
    
    this.brokenImages.add(src);
    imgElement.src = 'assets/placeholder.jpg';
  }

  title(): string {
    if (!this.directorate) return '';
    return this.lang.current === 'ar' 
      ? (this.directorate.nameAr || this.directorate.titleAr || 'بدون عنوان')
      : (this.directorate.nameEn || this.directorate.titleEn || 'No Title');
  }

  formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('01')) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    }
    return phone;
  }

  makePhoneCall(phoneNumber: string): void {
    if (!phoneNumber) return;
    window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`;
  }

  sendEmail(email: string): void {
    if (!email) return;
    const subject = encodeURIComponent(this.lang.current === 'ar' ? `استفسار عن ${this.title()}` : `Inquiry about ${this.title()}`);
    window.location.href = `mailto:${email}?subject=${subject}`;
  }

  goBack(): void {
    this.router.navigate(['/directorates']);
  }

  // دالة مفيدة لعرض الأنشطة بحد أقصى
  getLimitedActivities() {
    return this.directorate?.activities?.slice(0, 10) || [];
  }
}