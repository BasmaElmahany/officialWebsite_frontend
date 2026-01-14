// ...existing code...
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
  // دعم الاسم القديم في القالب

  displayedColumns: string[] = ['icon', 'name', 'managerName', 'phoneNumber', 'actions'];
  dataSource = new MatTableDataSource<CultureCenterRead>();

  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private centerService: CenterService,
    private router: Router,
    public i18n: I18nService, private dialog: MatDialog, private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.centerService.getAllSocialSocieties().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });

    // 🔥 Sorting based on language
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'name' || property === 'managerName' || property === 'phoneNumber') {
        return this.i18n.currentLang === 'ar'
          ? item.nameAr
          : item.nameEn || item.dirNameAr || item.dirNameEn || item.phoneNumber1 || '';
      }
      return '';
    };

    // 🔎 Filtering based on language
    this.dataSource.filterPredicate = (society, filter) => {
      const value = this.i18n.currentLang === 'ar'
        ? society.nameAr
        : society.nameEn || society.dirNameEn || society.dirNameAr || society.phoneNumber1 || '';

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

  getCenterName(center: CultureCenterRead): string {
    return this.i18n.currentLang === 'ar'
      ? center.nameAr
      : center.nameEn;
  }
  getManagerName(center: CultureCenterRead): string {
    const ar = center.dirNameAr?.trim() ?? '';
    const en = center.dirNameEn?.trim() ?? '';
    return (
      this.i18n.currentLang === 'ar'
        ? ar || en
        : en || ar
    ) || '—';
  }

  getPhoneNumber(center: CultureCenterRead): string {
    return center.phoneNumber1 ? center.phoneNumber1 : 'N/A';
  }



  goToCreate(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '420px',
      disableClose: true,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reloadCenters();
      }
    });
  }

  reloadCenters(): void {
    this.loading = true;
    this.centerService.getAllSocialSocieties().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openEdit(center: CultureCenterRead): void {
    const ref = this.dialog.open(EditComponent, {
      width: '420px',
      data: { id: center.id },
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.reloadCenters();
    });
  }

  openDetails(center: CultureCenterRead): void {
    this.dialog.open(DetailsComponent, {
      width: '520px',
      data: { id: center.id } as any,
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
      if (ok) this.reloadCenters();
    });
  }

  // دعم الاسم القديم في القالب
  getSocietyName(center: CultureCenterRead): string {
    return this.getCenterName(center);
  }
}
