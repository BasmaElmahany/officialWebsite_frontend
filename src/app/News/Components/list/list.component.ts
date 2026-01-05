import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GetNews } from '../../Models/news';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { NewsService } from '../../Services/news.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { DeleteComponent } from '../delete/delete.component';
import { NewsTypeService } from '../../../NewsTypes/Services/news-type.service';
import { NewsTypes } from '../../../NewsTypes/Models/newTypes';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['image', 'type', 'title', 'date', 'actions'];
  dataSource = new MatTableDataSource<GetNews>();
  loading = true;
  newsTypes: NewsTypes[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  typeMap = new Map<number, NewsTypes>();

  constructor(
    private newsService: NewsService, private typeService: NewsTypeService,
    public i18n: I18nService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTypesAndNews();

    // Sorting حسب اللغة
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'title') {
        return this.i18n.currentLang === 'ar'
          ? item.titleAr
          : item.titleEn;
      }
      if (property === 'date') {
        return item.date;
      }
      return '';
    };

    // Filter حسب اللغة
    this.dataSource.filterPredicate = (news, filter) => {
      const value = this.i18n.currentLang === 'ar'
        ? news.titleAr
        : news.titleEn;

      return value.toLowerCase().includes(filter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  // -------------------- LOAD DATA --------------------//
  // -------------------- LOAD DATA --------------------//


  loadNews(): void {
    this.loading = true;

    this.newsService.getAll().subscribe({
      next: res => {
        this.dataSource.data = res.data; // ✅ هنا التصحيح
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadTypesAndNews(): void {
    this.loading = true;

    this.typeService.getAllNewsTypes().subscribe({
      next: types => {
        this.newsTypes = types;

        // 🧠 Build map<number, NewsTypes>
        this.typeMap.clear();
        types.forEach(t => this.typeMap.set(t.id, t));

        // بعد الأنواع → حمّل الأخبار
        this.loadNews();
      },
      error: () => {
        this.newsTypes = [];
        this.loading = false;
      }
    });
  }


  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  getTitle(news: GetNews): string {
    return this.i18n.currentLang === 'ar'
      ? news.titleAr
      : news.titleEn;
  }



  getCoverImage(news: GetNews): string {
    if (!news.photos?.length) {
      return 'assets/images/placeholder.jpg';
    }
    return `https://shusha.minya.gov.eg:93${news.photos[0].photoUrl}`;
  }

  openCreate(): void {
    const ref = this.dialog.open(CreateComponent, {
      width: '460px',
      disableClose: true,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.loadNews();
      }
    });
  }
  LoadTypes(): void {
    this.typeService.getAllNewsTypes().subscribe({
      next: data => {
        this.newsTypes = data;
      },
      error: () => {
        this.newsTypes = [];
      }
    });
  }


  getNewsTypeName(typeId: number | null): string {
    if (typeId == null) return '—';

    const type = this.typeMap.get(typeId);
    if (!type) return '—';

    return this.i18n.currentLang === 'ar'
      ? type.nameAr
      : type.nameEn;
  }




  openEdit(news: GetNews): void {
    const ref = this.dialog.open(EditComponent, {
      width: '420px',
      data: news,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.loadNews();
    });
  }
  openDetails(news: GetNews): void {
    this.dialog.open(DetailsComponent, {
      width: '520px',
      data: { id: news.id } as any,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr',
      autoFocus: false
    });
  }

  openDelete(news: GetNews): void {
    const ref = this.dialog.open(DeleteComponent, {
      width: '380px',
      data: news,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.loadNews();
    });
  }

}