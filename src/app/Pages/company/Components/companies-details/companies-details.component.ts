import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from '../../../../Services/companies/companies.service';
import { Company } from '../../Models/company';
import { LanguageService } from '../../../../Shared/Services/language.service';

@Component({
  selector: 'app-companies-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './companies-details.component.html',
  styleUrls: ['./companies-details.component.scss'] // تم تغييرها لـ scss لتطابق استايلك
})
export class CompaniesDetailsComponent implements OnInit {
  
  id!: string;
  loading = true;
  company?: Company;

  constructor(
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    public lang: LanguageService,
    private router: Router
  ) {
    // جلب الـ ID من الحالة (State) المرسلة من صفحة العرض
    const state = history.state as { id?: string };

    if (!state?.id) {
      // إذا حاول المستخدم فتح الرابط مباشرة بدون ID، يتم توجيهه لصفحة الشركات
      this.router.navigate(['/companies']);
      return;
    }

    this.id = state.id;
  }

  ngOnInit(): void {
    this.companiesService.getCompanyById(this.id).subscribe({
      next: (res: any) => {
        // بناءً على الـ Interface الخاص بك: ApiResponse<T> نستخدم res.data
        this.company = res.data;

        // تهيئة الأنشطة والخدمات كقوائم فارغة إذا كانت غير معرفة
        if (this.company) {
          this.company.activities = this.company.activities || [];
          this.company.services = this.company.services || [];
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/companies']);
      }
    });
  }

  // لوجيك العناوين المترجمة
  title(): string {
    if (!this.company) return '';
    return this.lang.current === 'ar' ? this.company.nameAr : this.company.nameEn;
  }

  // لوجيك العنوان/الوصف المترجم
  address(): string {
    if (!this.company) return '';
    return this.lang.current === 'ar' 
      ? (this.company.addressAr || '') 
      : (this.company.addressEn || '');
  }

  // بناء رابط الصورة بنفس لوجيك GovTours
  imageUrl(path: string | undefined | null): string {
    if (!path) return 'assets/placeholder.jpg';
    const baseUrl = 'https://shusha.minya.gov.eg:93';
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return `${baseUrl}${cleanPath}`;
  }
}