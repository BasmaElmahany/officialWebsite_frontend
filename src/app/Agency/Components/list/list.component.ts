import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Agency, AgencyRead } from '../../Models/agency';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AgncyService } from '../../Services/agncy.service';
import { Router } from '@angular/router';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { Center } from '../../../Center/Models/center';
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
  dataSource = new MatTableDataSource<AgencyRead>();

  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private agncyService: AgncyService,
    private router: Router,
    public i18n: I18nService, private dialog: MatDialog, private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.agncyService.getAllAgencies().subscribe({
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
    this.dataSource.filterPredicate = (directorate, filter) => {
      const value = this.i18n.currentLang === 'ar'
        ? directorate.nameAr
        : directorate.nameEn || directorate.dirNameEn || directorate.dirNameAr || directorate.phoneNumber1 || ''  ;

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

  getAgencyName(agency: Agency): string {
    return this.i18n.currentLang === 'ar'
      ? agency.nameAr
      : agency.nameEn;
  }
  getManagerName(agency: Agency): string {
  const ar = agency.dirNameAr?.trim() ?? '';
  const en = agency.dirNameEn?.trim() ?? '';

  return (
    this.i18n.currentLang === 'ar'
      ? ar || en
      : en || ar
  ) || '—';
}

     getPhoneNumber(agency: Agency): string {
    return agency.phoneNumber1 ? agency.phoneNumber1 : 'N/A';
      
  }



  goToCreate(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '420px',
      disableClose: true,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reloadAgency();
      }
    });
  }


  reloadAgency(): void {
    this.loading = true;
    this.agncyService.getAllAgencies().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openEdit(agency: Agency): void {
    const ref = this.dialog.open(EditComponent, {
      width: '420px',
      data: { id: agency.id },
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.reloadAgency();
    });
  }
  openDetails(agency: Agency): void {
    this.dialog.open(DetailsComponent, {
      width: '520px',
      data: { id: agency.id } as any,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr',
      autoFocus: false
    });
  }

  openDelete(directorate: Agency): void {
    const ref = this.dialog.open(DeleteComponent, {
      width: '380px',
      data: directorate,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.reloadAgency();
    });
  }
}