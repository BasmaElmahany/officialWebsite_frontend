import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'; // <--- تم إضافة هذا لحل خطأ mat-card
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
    MatCardModule, // <--- تم إضافة هذا لتفعيل الكروت الملونة
    RouterModule
  ],
  templateUrl: './directorates-details.component.html',
  styleUrls: ['./directorates-details.component.scss']
})
export class DirectoratesDetailsComponent implements OnInit {
  id!: string;
  loading = true;
  directorate?: Directorate;
  
  private brokenImages: Set<string> = new Set();
  
  isMobile: boolean = false;
  screenWidth: number = window.innerWidth;

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
        const rawData = res.data ? res.data : res;

        if (rawData) {
          // حل مشكلة اختلاف أسماء الحقول بين الـ API والـ Model
          if (rawData.dirphotoUrl && !rawData.dirPhotoUrl) {
            rawData.dirPhotoUrl = rawData.dirphotoUrl;
          }
        }

        this.directorate = rawData;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading directorate:', error);
        this.loading = false;
      }
    });
  }

  // دالة بناء رابط الصورة مع معالجة الأخطاء
  imageUrl(path: string | undefined): string {
    if (!path || this.brokenImages.has(path)) {
      return 'assets/placeholder.jpg';
    }
    
    let fullUrl = path;
    if (!fullUrl.startsWith('http')) {
      const baseUrl = 'https://shusha.minya.gov.eg:93';
      fullUrl = fullUrl.startsWith('/') ? `${baseUrl}${fullUrl}` : `${baseUrl}/${fullUrl}`;
    }
    
    return fullUrl;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    const src = imgElement.src;
    this.brokenImages.add(src);
    imgElement.src = 'assets/placeholder.jpg';
  }

  // دالة لفتح الروابط الخارجية (تستخدم في زر البوابة الإلكترونية)
  goToLink(url: string | undefined): void {
    if (url) {
      // التأكد من أن الرابط يبدأ بـ http ليعمل بشكل صحيح
      const externalUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(externalUrl, "_blank");
    }
  }

  title(): string {
    if (!this.directorate) return '';
    return this.lang.current === 'ar' 
      ? (this.directorate.nameAr || this.directorate.titleAr || 'بدون عنوان')
      : (this.directorate.nameEn || this.directorate.titleEn || 'No Title');
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
}