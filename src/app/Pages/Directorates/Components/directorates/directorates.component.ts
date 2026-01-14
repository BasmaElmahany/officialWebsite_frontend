import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../../../Shared/Services/language.service';
import { DirectoratesService } from '../../../Services/directorates/directorates.service';
import { Directorate } from '../../../Models/directorates';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-directorates',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './directorates.component.html',
  styleUrls: ['./directorates.component.scss']
})
export class DirectoratesComponent implements OnInit, OnDestroy {
  loading = true;
  directorates: Directorate[] = [];
  
  // Pagination Properties
  currentPage: number = 1;
  pageSize: number = 6; // عدد العناصر في الصفحة الواحدة
  pageSizeOptions: number[] = [3, 6, 9, 12, 15];
  totalPages: number = 0;
  totalItems: number = 0;
  
  // View Options
  viewMode: 'grid' | 'list' = 'grid';
  
  // Filter Properties
  searchQuery: string = '';
  filteredDirectorates: Directorate[] = [];
  
  // Responsive Properties
  isMobile: boolean = false;
  screenWidth: number = window.innerWidth;
  
  // Track broken images
  brokenImages: Set<string> = new Set();
  
  private resizeSubscription?: Subscription;

  constructor(
    private directoratesService: DirectoratesService,
    public lang: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadDirectorates();
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.checkScreenSize();
    this.adjustPageSizeForScreen();
  }

  private checkScreenSize(): void {
    this.isMobile = this.screenWidth <= 768;
  }

  private adjustPageSizeForScreen(): void {
    if (this.screenWidth <= 480) {
      this.pageSize = 3;
    } else if (this.screenWidth <= 768) {
      this.pageSize = 4;
    } else if (this.screenWidth <= 1024) {
      this.pageSize = 6;
    } else {
      this.pageSize = 8;
    }
    this.calculatePagination();
  }

  loadDirectorates(): void {
    this.loading = true;
    this.directoratesService.getAllDirectorates().subscribe({
      next: (res: any) => {
        this.directorates = Array.isArray(res) ? res : [];
        this.filteredDirectorates = [...this.directorates];
        this.totalItems = this.directorates.length;
        this.calculatePagination();
        this.loading = false;
        console.log('Directorates loaded:', this.directorates);
      },
      error: (err) => {
        console.error('API Error:', err);
        this.directorates = [];
        this.filteredDirectorates = [];
        this.loading = false;
      }
    });
  }

  // Pagination Methods
  calculatePagination(): void {
    if (!this.filteredDirectorates || this.filteredDirectorates.length === 0) {
      this.totalPages = 0;
      return;
    }
    
    this.totalPages = Math.ceil(this.filteredDirectorates.length / this.pageSize);
    
    // Ensure current page is valid
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    
    // Update total items count
    this.totalItems = this.filteredDirectorates.length;
  }

  get paginatedDirectorates(): Directorate[] {
    if (!this.filteredDirectorates || this.filteredDirectorates.length === 0) {
      return [];
    }
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    return this.filteredDirectorates.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollToTop();
    }
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  changePageSize(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1; // Reset to first page when changing page size
    this.calculatePagination();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = this.isMobile ? 3 : 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;
      
      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  // Filter Methods
  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredDirectorates = [...this.directorates];
    } else {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredDirectorates = this.directorates.filter(directorate => {
        const nameAr = directorate.nameAr?.toLowerCase() || '';
        const nameEn = directorate.nameEn?.toLowerCase() || '';
        const descAr = directorate.descriptionAr?.toLowerCase() || '';
        const descEn = directorate.descriptionEn?.toLowerCase() || '';
        
        return nameAr.includes(query) || 
               nameEn.includes(query) || 
               descAr.includes(query) || 
               descEn.includes(query);
      });
    }
    
    this.currentPage = 1; // Reset to first page after filtering
    this.calculatePagination();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearch();
  }

  // View Mode Methods
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  // Image Error Handling
  onImageError(event: Event, directorate: Directorate): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/placeholder.jpg';
    
    // Track this image as broken for future reference
    if (directorate.photoUrl) {
      this.brokenImages.add(directorate.photoUrl);
    }
  }

  // Utility Methods
  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  title(d: Directorate): string {
    return this.lang.current === 'ar' ? (d.nameAr || 'بدون عنوان') : (d.nameEn || 'No Title');
  }

  excerpt(d: Directorate): string {
    const text = this.lang.current === 'ar' 
      ? (d.descriptionAr || d.addressAr || '') 
      : (d.descriptionEn || d.addressEn || '');
    
    const maxLength = this.viewMode === 'list' ? 100 : 120;
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  cover(d: Directorate): string {
    if (!d.photoUrl) {
      return 'assets/placeholder.jpg';
    }
    
    // Check if this image was previously broken
    if (this.brokenImages.has(d.photoUrl)) {
      return 'assets/placeholder.jpg';
    }
    
    // Construct full URL
    let fullUrl = d.photoUrl;
    
    if (!fullUrl.startsWith('http')) {
      if (fullUrl.startsWith('/')) {
        fullUrl = `https://shusha.minya.gov.eg:93${fullUrl}`;
      } else {
        fullUrl = `https://shusha.minya.gov.eg:93/${fullUrl}`;
      }
    }
    
    return fullUrl;
  }

  openDetails(id: string): void {
    this.router.navigate(['/directorates/details'], { state: { id } });
  }

  // Helper method for pagination info text
  getPaginationInfo(): string {
    if (this.filteredDirectorates.length === 0) {
      return this.lang.current === 'ar' ? 'لا توجد بيانات' : 'No data available';
    }
    
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    
    if (this.lang.current === 'ar') {
      return `عرض ${start}-${end} من ${this.totalItems}`;
    } else {
      return `Showing ${start}-${end} of ${this.totalItems}`;
    }
  }

  // Helper method for page size label
  getPageSizeLabel(): string {
    if (this.lang.current === 'ar') {
      return `عناصر في الصفحة: ${this.pageSize}`;
    } else {
      return `Items per page: ${this.pageSize}`;
    }
  }
}
