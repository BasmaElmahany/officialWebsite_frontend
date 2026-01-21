import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { VideoRead } from '../../Models/video';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { VideoService } from '../../Services/video.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { DeleteComponent } from '../delete/delete.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['title', 'article', 'date', 'actions'];
  dataSource = new MatTableDataSource<VideoRead>();
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: VideoService,
    public i18n: I18nService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadVideos();

    // Sorting حسب اللغة
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'title') {
        return this.i18n.currentLang === 'ar'
          ? item.titleAr
          : item.titleEn;
      }
      if (property === 'article') {
        return this.i18n.currentLang === 'ar'
          ? item.articleAr
          : item.articleEn;
      }
      if (property === 'date') {
        return item.date;
      }
      return '';
    };

    // Filter حسب اللغة
    this.dataSource.filterPredicate = (video, filter) => {
      const value = this.i18n.currentLang === 'ar'
        ? video.titleAr
        : video.titleEn;

      return value.toLowerCase().includes(filter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  loadVideos(): void {
    this.loading = true;

    this.service.getAllVideos().subscribe({
      next: res => {
        this.dataSource.data = res;
        console.log(res);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  getTitle(video: any): string {
    return this.i18n.currentLang === 'ar'
      ? video.titleAr
      : video.titleEn;
  }

  getArticle(video: any): string {
    return this.i18n.currentLang === 'ar'
      ? video.articleAr.slice(0, 50) + '...'
      : video.articleEn.slice(0, 50) + '...';
  }
  openCreate(): void {
    const ref = this.dialog.open(CreateComponent, {
      width: '460px',
      disableClose: true,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.loadVideos();
      }
    });
  }
  openEdit(video: VideoRead): void {
    const ref = this.dialog.open(EditComponent, {
      width: '420px',
      data: video,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.loadVideos();
    });
  }
  openDetails(video: VideoRead): void {
    this.dialog.open(DetailsComponent, {
      width: '520px',
      data: { id: video.id } as any,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr',
      autoFocus: false
    });
  }

  openDelete(video: VideoRead): void {
    const ref = this.dialog.open(DeleteComponent, {
      width: '380px',
      data: video,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.loadVideos();
    });
  }

}