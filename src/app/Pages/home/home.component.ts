import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '../../Shared/Pipes/translate.pipe';
import { DataService } from '../../Shared/Services/data/data.service';
import { LanguageService } from '../../Shared/Services/language.service';
import { GetNews, NewsTypes } from '../Models/news';
import { NewsService } from '../Services/news/news.service';
import { NewsTypesService } from '../Services/newsTypes/news-types.service';
import { forkJoin } from 'rxjs';
import { GetGovTours } from '../Models/govtours';
import { GovToursService } from '../Services/govTours/gov-tours.service';

type NewsSection = {
  typeId: number;
  typeName: { ar: string; en: string };
  major: GetNews;
  list: GetNews[];
};

type GovTourSection = {
  major: GetGovTours;
  list: GetGovTours[];
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatChipsModule, MatButtonModule,
    MatTabsModule, MatIconModule, TranslatePipe, RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  sliderData = [
    { bg: '/assets/images/nile_river.jpg', color: '#c5a059' },
    { bg: '/assets/images/Travel_Tips.jpg', color: '#b11f37' },
    { bg: '/assets/images/hero_banner.png', color: '#8fa04a' },
    { bg: '/assets/images/kornish5.jpg', color: '#2980b9' }
  ];

  activeSlideIndex: number = 0;
  autoPlayInterval: any;

  newsByType: NewsSection[] = [];
  newsTypes: NewsTypes[] = [];
  news: GetNews[] = [];
  
  // المتغير الجديد لتخزين آخر خبر من كل نوع
  latestNewsPerType: GetNews[] = [];

  govToursSection?: GovTourSection;

  constructor(
    public data: DataService, 
    public lang: LanguageService, 
    public router: Router, 
    private newsService: NewsService,
    private typesService: NewsTypesService, 
    private govToursService: GovToursService
  ) { }

  ngOnInit(): void {
    this.startAutoPlay();

    // جولات المحافظ
    this.govToursService.getAll().subscribe({
      next: res => {
        const items = (res.data ?? [])
          .sort((a, b) => +new Date(b.date) - +new Date(a.date));

        if (items.length) {
          this.govToursSection = {
            major: items[0],
            list: items.slice(1, 4)
          };
        }
      }
    });

    // جلب البيانات بشكل متوازي
    forkJoin({
      types: this.typesService.getAllNewsTypes(),
      allNews: this.newsService.getAll(),
      latest: this.newsService.getLatestNewsByType()
    }).subscribe({
      next: ({ types, allNews, latest }) => {
        this.newsTypes = types ?? [];
        this.news = allNews.data ?? [];
        this.latestNewsPerType = latest.data ?? [];
        
        this.buildNewsSections();
      },
      error: (err) => {
        console.error('Error loading home data', err);
        this.newsTypes = [];
        this.news = [];
        this.latestNewsPerType = [];
        this.newsByType = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  // دالة للحصول على اسم النوع (مثل الزيارات) لاستخدامها في الـ Badge
  getTypeName(typeId: number): string {
    const type = this.newsTypes.find(t => t.id === typeId);
    if (type) {
      return this.lang.current === 'ar' ? type.nameAr : type.nameEn;
    }
    return this.lang.current === 'ar' ? 'أخبار' : 'News';
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.activeSlideIndex = (this.activeSlideIndex + 1) % this.sliderData.length;
    }, 4000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  private buildNewsSections(): void {
    const types = this.newsTypes;
    const news = this.news;

    this.newsByType = types
      .map((type): NewsSection | null => {
        const items = news
          .filter(n => n.typeId === type.id)
          .sort((a, b) => +new Date(b.date) - +new Date(a.date));

        if (!items.length) return null;

        return {
          typeId: type.id,
          typeName: { ar: type.nameAr, en: type.nameEn },
          major: items[0],
          list: items.slice(1, 3)
        };
      })
      .filter((x): x is NewsSection => x !== null);
  }

  setActiveSlide(index: number) {
    this.activeSlideIndex = index;
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  todayISO = new Date().toISOString();
  
  text(localized: { ar: string; en: string }) { 
    return this.lang.current === 'ar' ? localized.ar : localized.en; 
  }

  iconForService(category: string) {
    switch (category) {
      case 'health': return 'local_hospital';
      case 'education': return 'school';
      case 'social': return 'diversity_3';
      case 'investment': return 'business_center';
      case 'utilities': return 'account_balance';
      default: return 'public';
    }
  }

  newsTitle(n: GetNews): string {
    return this.lang.current === 'ar' ? n.titleAr : n.titleEn;
  }

  newsExcerpt(n: GetNews, limit: number): string {
    const text = this.lang.current === 'ar' ? n.articleAr : n.articleEn;
    return text.length > limit ? text.slice(0, limit) + '…' : text;
  }

  govToursExcerpt(n: GetGovTours, limit: number): string {
    const text = this.lang.current === 'ar' ? n.articleAr : n.articleEn;
    return text.length > limit ? text.slice(0, limit) + '…' : text;
  }

  cover(n: GetNews): string {
    return n.photos?.length
      ? 'https://shusha.minya.gov.eg:93' + n.photos[0].photoUrl
      : '/assets/placeholder.jpg';
  }

  openNewsDetails(id: string): void {
    this.router.navigate(['/news/details'], { state: { id } });
  }

  formatDate(date: string): string {
    const locale = this.lang.current === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  openGovToursDetails(id: string): void {
    this.router.navigate(['/gov-tours/details'], { state: { id } });
  }
}
