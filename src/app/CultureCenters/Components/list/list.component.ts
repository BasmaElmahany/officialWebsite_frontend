import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CultureCenterRead } from '../../Models/Center';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { MatDialog } from '@angular/material/dialog';
import { CenterService } from '../../Services/center.service';
import { Router } from '@angular/router';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { DeleteComponent } from '../delete/delete.component';
import { ToastService } from '../../../Shared/Services/toast/toast.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['icon', 'name', 'managerName', 'phoneNumber', 'actions'];
  dataSource = new MatTableDataSource<CultureCenterRead>();
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private centerService: CenterService,
    private router: Router,
    public i18n: I18nService, 
    private dialog: MatDialog, 
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadData();

    // إعدادات الفرز (Sorting)
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'name':
          return (this.i18n.currentLang === 'ar' ? item.nameAr : item.nameEn) ?? '';
        case 'managerName':
          return (this.i18n.currentLang === 'ar' ? item.dirNameAr : item.dirNameEn) ?? '';
        case 'phoneNumber':
          return item.phoneNumber1 ?? '';
        default:
          // fallback: always return string or number
          const value = item[property as keyof typeof item];
          return (typeof value === 'string' || typeof value === 'number') ? value : '';
      }
    };

    // إعدادات البحث (Filtering)
    this.dataSource.filterPredicate = (data, filter) => {
      const searchStr = `${data.nameAr} ${data.nameEn} ${data.dirNameAr} ${data.dirNameEn} ${data.phoneNumber1}`.toLowerCase();
      return searchStr.includes(filter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData(): void {
    this.loading = true;
    this.centerService.getAllCultureCenters().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error(this.i18n.currentLang === 'ar' ? 'حدث خطأ في تحميل البيانات' : 'Error loading data');
      }
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  // دالة موحدة للحصول على الاسم
  getDisplayName(center: CultureCenterRead): string {
    if (!center) return '';
    return this.i18n.currentLang === 'ar' 
      ? (center.nameAr || center.nameEn) 
      : (center.nameEn || center.nameAr);
  }

  // دالة موحدة للحصول على اسم المدير
  getDisplayManager(center: CultureCenterRead): string {
    if (!center) return '';
    const ar = center.dirNameAr?.trim();
    const en = center.dirNameEn?.trim();
    return (this.i18n.currentLang === 'ar' ? (ar || en) : (en || ar)) || '—';
  }

  getPhoneNumber(center: CultureCenterRead): string {
    return center.phoneNumber1 || 'N/A';
  }

  goToCreate(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '420px',
      disableClose: true,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  openEdit(center: CultureCenterRead): void {
    const ref = this.dialog.open(EditComponent, {
      width: '420px',
      data: { id: center.id },
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.loadData();
    });
  }

  openDetails(center: CultureCenterRead): void {
    this.dialog.open(DetailsComponent, {
      width: '520px',
      data: { id: center.id },
      direction: this.i18n.isRTL ? 'rtl' : 'ltr',
      autoFocus: false
    });
  }

  openDelete(center: CultureCenterRead): void {
    const ref = this.dialog.open(DeleteComponent, {
      width: '380px',
      data: center,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.loadData();
    });
  }
}