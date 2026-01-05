import { Component, Inject } from '@angular/core';
import { GetNews } from '../../Models/news';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { NewsService } from '../../Services/news.service';
import { NewsTypes } from '../../../NewsTypes/Models/newTypes';
import { NewsTypeService } from '../../../NewsTypes/Services/news-type.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  loading = true;
  news?: GetNews;
  typeMap = new Map<number, NewsTypes>();
  newsTypes: NewsTypes[] = [];
  constructor(
    private newsService: NewsService, private typeService: NewsTypeService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GetNews,
    public i18n: I18nService
  ) {
    // ✅ Always re-fetch by id to ensure you have the latest/full entity
    const id = (data as any)?.id;

    if (!id) {
      this.loading = false;
      this.news = data;
      return;
    }
    this.typeService.getAllNewsTypes().subscribe({
      next: types => {
        this.newsTypes = types;

        // 🧠 Build map<number, NewsTypes>
        this.typeMap.clear();
        types.forEach(t => this.typeMap.set(t.id, t));   },
      error: () => {
        this.newsTypes = [];
        this.loading = false;
      }
    });
    this.newsService.getById(id).subscribe({
      next: (c) => {
        this.news = c.data;
        this.loading = false;
      },
      error: () => {
        // fallback to passed data if API fails
        this.news = data;
        this.loading = false;
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


  close(): void {
    this.dialogRef.close(false);
  }
}
