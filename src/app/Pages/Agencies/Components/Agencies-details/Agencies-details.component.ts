import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../../../Shared/Services/language.service';
import { AgenciesService } from '../../../../Services/Agencies/Agencies.service';
import { Agency } from '../../Models/Agencies';

@Component({
  selector: 'app-agencies-details',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './Agencies-details.component.html',
  styleUrls: ['./Agencies-details.component.scss']
})
export class AgenciesDetailsComponent implements OnInit {
  id!: string;
  loading = true;
  agency?: Agency;
  private brokenImages: Set<string> = new Set();
  isMobile: boolean = false;
  screenWidth: number = window.innerWidth;

  constructor(
    private route: ActivatedRoute,
    private service: AgenciesService,
    public lang: LanguageService,
    private router: Router
  ) {
    const state = history.state as { id?: string };
    if (!state?.id) {
      this.router.navigate(['/agencies']);
      return;
    }
    this.id = state.id;
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.loadAgencyDetails();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = this.screenWidth <= 768;
  }

  loadAgencyDetails(): void {
    this.loading = true;
    this.service.getAgencyById(this.id).subscribe({
      next: (res: any) => {
        this.agency = res.data || res;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading agency:', error);
        this.loading = false;
      }
    });
  }

  // --- لوجيك الصور والعناوين الموحد ---

  cover(agency: Agency | undefined): string {
    return this.imageUrl(agency?.photoUrl);
  }

  title(agency: Agency | undefined): string {
    if (!agency) return '';
    return this.lang.current === 'ar' 
      ? (agency.nameAr || 'بدون عنوان')
      : (agency.nameEn || 'No Title');
  }

  handleImageError(event: Event, agency: Agency | undefined): void {
    const imgElement = event.target as HTMLImageElement;
    // تخزين الرابط المكسور حتى لا نحاول تحميله مرة أخرى في الدورة القادمة
    this.brokenImages.add(imgElement.src);
    imgElement.src = 'assets/images/default-image.png'; // تأكد من صحة هذا المسار في ملفاتك
  }

  imageUrl(path: string | undefined): string {
    if (!path || this.brokenImages.has(path)) {
      return 'assets/images/default-image.png';
    }

    // إذا كان المسار كاملاً بالفعل
    if (path.startsWith('http')) {
      return path;
    }

    // بناء الرابط للسيرفر الخارجي
    const baseUrl = 'https://shusha.minya.gov.eg:93';
    // التأكد من أن المسار يبدأ بـ / واحد فقط
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${baseUrl}${cleanPath}`;
  }

  goBack(): void {
    this.router.navigate(['/agencies']);
  }
}