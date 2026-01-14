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
  styleUrls: ['./companies-details.component.scss']
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
    const state = history.state as { id?: string };

    if (!state?.id) {
      this.router.navigate(['/companies']);
      return;
    }

    this.id = state.id;
  }

  ngOnInit(): void {
    this.companiesService.getCompanyById(this.id).subscribe({
      next: (res: any) => {
        this.company = res.data;

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

  // --- الدوال الجديدة لحل أخطاء الـ HTML ---

  /**
   * دالة الاتصال الهاتفي
   */
  makePhoneCall(phoneNumber: string): void {
    if (phoneNumber) {
      // تنظيف الرقم من المسافات أو الرموز لضمان عمل الاتصال
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      window.location.href = `tel:${cleanNumber}`;
    }
  }

  /**
   * دالة فتح الروابط الخارجية (الموقع الإلكتروني)
   */
  goToLink(url: string | undefined): void {
    if (url) {
      // التأكد من أن الرابط يبدأ بـ http ليعمل بشكل صحيح كطرف خارجي
      const externalUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(externalUrl, "_blank");
    }
  }

  // --- لوجيك البيانات المترجمة ---

  title(): string {
    if (!this.company) return '';
    return this.lang.current === 'ar' ? this.company.nameAr : this.company.nameEn;
  }

  address(): string {
    if (!this.company) return '';
    return this.lang.current === 'ar' 
      ? (this.company.addressAr || '') 
      : (this.company.addressEn || '');
  }

  imageUrl(path: string | undefined | null): string {
    if (!path) return 'assets/placeholder.jpg';
    const baseUrl = 'https://shusha.minya.gov.eg:93';
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return `${baseUrl}${cleanPath}`;
  }

  // دالة احتياطية في حال فشل تحميل الصورة الأصلية
  handleImageError(event: any): void {
    event.target.src = 'assets/placeholder.jpg';
  }
}