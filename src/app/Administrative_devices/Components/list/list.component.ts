import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AdministrativeDeviceRead } from '../../Models/AdministrativeDevice';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { MatDialog } from '@angular/material/dialog';
import { AdministrativeDevicesService } from '../../Services/administrative-devices.service';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { DeleteComponent } from '../delete/delete.component';
import { ToastService } from '../../../Shared/Services/toast/toast.service';

@Component({
  selector: 'app-administrative-devices-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['icon', 'name', 'serialNumber', 'type', 'status', 'location', 'actions'];
  dataSource = new MatTableDataSource<AdministrativeDeviceRead>();
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminDevicesService: AdministrativeDevicesService,
    public i18n: I18nService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'name':
          return this.i18n.currentLang === 'ar' ? item.nameAr : item.nameEn;
        case 'serialNumber':
          return item.serialNumber ?? '';
        case 'type':
          return item.type ?? '';
        case 'status':
          return item.status ?? '';
        case 'location':
          return item.location ?? '';
        default:
          const value = item[property as keyof typeof item];
          return (typeof value === 'string' || typeof value === 'number') ? value : '';
      }
    };
    this.dataSource.filterPredicate = (data, filter) => {
      const searchStr = `${data.nameAr} ${data.nameEn} ${data.serialNumber} ${data.type} ${data.status} ${data.location}`.toLowerCase();
      return searchStr.includes(filter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData(): void {
    this.loading = true;
    this.adminDevicesService.getAll().subscribe({
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

  getDisplayName(device: AdministrativeDeviceRead): string {
    if (!device) return '';
    return this.i18n.currentLang === 'ar' ? (device.nameAr || device.nameEn) : (device.nameEn || device.nameAr);
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

  openEdit(device: AdministrativeDeviceRead): void {
    const ref = this.dialog.open(EditComponent, {
      width: '420px',
      data: { id: device.id },
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.loadData();
    });
  }

  openDetails(device: AdministrativeDeviceRead): void {
    this.dialog.open(DetailsComponent, {
      width: '520px',
      data: { id: device.id },
      direction: this.i18n.isRTL ? 'rtl' : 'ltr',
      autoFocus: false
    });
  }

  openDelete(device: AdministrativeDeviceRead): void {
    const ref = this.dialog.open(DeleteComponent, {
      width: '380px',
      data: device,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.loadData();
    });
  }
}
