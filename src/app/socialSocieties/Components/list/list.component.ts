import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { socialSocieties, socialSocietiesRead } from '../../Models/society';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { MatDialog } from '@angular/material/dialog';
import { CenterService } from '../../Services/society.service';
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
  dataSource = new MatTableDataSource<socialSocietiesRead>();

  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private societyService: CenterService,
    private router: Router,
    public i18n: I18nService, private dialog: MatDialog, private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.societyService.getAllSocialSocieties().subscribe({
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

  getSocietyName(society: socialSocieties): string {
    return this.i18n.currentLang === 'ar'
      ? society.nameAr
      : society.nameEn;
  }
  getManagerName(society: socialSocieties): string {
    const ar = society.dirNameAr?.trim() ?? '';
    const en = society.dirNameEn?.trim() ?? '';

    return (
      this.i18n.currentLang === 'ar'
        ? ar || en
        : en || ar
    ) || '—';
  }

  getPhoneNumber(society: socialSocieties): string {
    return society.phoneNumber1 ? society.phoneNumber1 : 'N/A';
  }



  goToCreate(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '420px',
      disableClose: true,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reloadSocieties();
      }
    });
  }

  reloadSocieties(): void {
    this.loading = true;
    this.societyService.getAllSocialSocieties().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openEdit(society: socialSocieties): void {
    const ref = this.dialog.open(EditComponent, {
      width: '420px',
      data: { id: society.id },
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.reloadSocieties();
    });
  }
  openDetails(society: socialSocieties): void {
    this.dialog.open(DetailsComponent, {
      width: '520px',
      data: { id: society.id } as any,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr',
      autoFocus: false
    });
  }

  openDelete(society: socialSocieties): void {
    const ref = this.dialog.open(DeleteComponent, {
      width: '380px',
      data: society,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.reloadSocieties();
    });
  }
}
