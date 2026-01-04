import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NewsTypes } from '../../Models/newTypes';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { MatDialog } from '@angular/material/dialog';
import { NewsTypeService } from '../../Services/news-type.service';
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

  displayedColumns: string[] = ['icon', 'name', 'actions'];
  dataSource = new MatTableDataSource<NewsTypes>();
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: NewsTypeService,
    private router: Router,
    public i18n: I18nService, private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.service.getAllNewsTypes().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });

    // 🔥 Sorting based on language
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'name') {
        return this.i18n.currentLang === 'ar'
          ? item.nameAr
          : item.nameEn;
      }
      return '';
    };

    // 🔎 Filtering based on language
    this.dataSource.filterPredicate = (center, filter) => {
      const value = this.i18n.currentLang === 'ar'
        ? center.nameAr
        : center.nameEn;
      return value.toLowerCase().includes(filter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  getNewsTypeName(newsType: NewsTypes): string {
    return this.i18n.currentLang === 'ar'
      ? newsType.nameAr
      : newsType.nameEn;
  }


  goToCreate(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '420px',
      disableClose: true,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reloadNewsTypes();
      }
    });
  }


  reloadNewsTypes(): void {
    this.loading = true;
    this.service.getAllNewsTypes().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openEdit(newsType: NewsTypes): void {
    const ref = this.dialog.open(EditComponent, {
      width: '420px',
      data: newsType,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.reloadNewsTypes();
    });
  }
  openDetails(newsType: NewsTypes): void {
    this.dialog.open(DetailsComponent, {
      width: '520px',
      data: { id: newsType.id } as any,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr',
      autoFocus: false
    });
  }

  openDelete(newsType: NewsTypes): void {
    const ref = this.dialog.open(DeleteComponent, {
      width: '380px',
      data: newsType,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.reloadNewsTypes();
    });
  }

}
