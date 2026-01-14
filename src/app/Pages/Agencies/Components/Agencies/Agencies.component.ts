import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../../../Shared/Services/language.service';
import { AgenciesService } from '../../../../Services/Agencies/Agencies.service';
import { Agency } from '../../Models/Agencies';

@Component({
  selector: 'app-agencies',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './Agencies.component.html',
  styleUrls: ['./Agencies.component.scss']
})
export class AgenciesComponent implements OnInit {
  loading = true;
  agencies: Agency[] = [];
  // السطر المضاف لربط التصميم الجديد
  selectedAgency: Agency | null = null;

  constructor(
    private agenciesService: AgenciesService,
    public lang: LanguageService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.agenciesService.getAgencies().subscribe({
      next: (res) => {
        this.agencies = res;
        this.loading = false;
        // تعيين أول عنصر ليعمل الـ Explorer فور التحميل
        if (this.agencies.length > 0) {
          this.selectedAgency = this.agencies[0];
        }
        console.log('Agencies data:', res);
      },
      error: () => (this.loading = false)
    });
  }

  title(a: Agency): string {
    return this.lang.current === 'ar' ? a.nameAr : a.nameEn;
  }

  excerpt(a: Agency): string {
    const text = this.lang.current === 'ar' ? (a.addressAr || '') : (a.addressEn || '');
    return text.length > 100 ? text.slice(0, 100) + '...' : text;
  }

  cover(a: Agency): string {
    if (a.photoUrl) {
      const baseUrl = 'https://shusha.minya.gov.eg:93';
      const path = a.photoUrl.startsWith('/') ? a.photoUrl : '/' + a.photoUrl;
      return `${baseUrl}${path}`;
    }
    return 'https://via.placeholder.com/150';
  }

  handleImageError(event: any, agency: Agency): void {
    console.log('Image error for agency:', agency.nameAr || agency.nameEn);
    event.target.src = 'https://via.placeholder.com/150';
  }

  openDetails(id: string): void {
    this.router.navigate(['/agencies/details'], { state: { id } });
  }

  getCardColor(index: number): string {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    return colors[index % colors.length];
  }
}