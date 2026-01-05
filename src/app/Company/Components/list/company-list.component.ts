import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../../Services/company.service';
import { Company, CompanyRead } from '../../Models/company';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CompanyCreateComponent } from '../create/company-create.component';
import { CompanyEditComponent } from '../edit/company-edit.component';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { CompanyDetailsComponent } from '../details/company-details.component';
import { CompanyDeleteComponent } from '../delete/company-delete.component';
import { Router } from '@angular/router';
import { ToastService } from '../../../Shared/Services/toast/toast.service';
import { CreateComponent } from '../../../Center/Components/create/create.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['icon', 'name', 'managerName', 'phoneNumber', 'actions'];
  dataSource = new MatTableDataSource<CompanyRead>();

  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: CompanyService,
    private router: Router,
    public i18n: I18nService, private dialog: MatDialog, private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.service.getAllCompanies().subscribe({
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
    this.dataSource.filterPredicate = (company, filter) => {
      const value = this.i18n.currentLang === 'ar'
        ? company.nameAr
        : company.nameEn || company.dirNameAr || company.dirNameEn || company.phoneNumber1 || '';

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

  getCompanyName(company: Company): string {
    return this.i18n.currentLang === 'ar'
      ? company.nameAr
      : company.nameEn;
  }
  getManagerName(company: Company): string {
    const ar = company.dirNameAr?.trim() ?? '';
    const en = company.dirNameEn?.trim() ?? '';

    return (
      this.i18n.currentLang === 'ar'
        ? ar || en
        : en || ar
    ) || '—';
  }



  getPhoneNumber(company: Company): string {
    return company.phoneNumber1 ? company.phoneNumber1 : 'N/A';

  }



  goToCreate(): void {
    const dialogRef = this.dialog.open(CompanyCreateComponent, {
      width: '420px',
      disableClose: true,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reloadCompanies();
      }
    });
  }


  reloadCompanies(): void {
    this.loading = true;
    this.service.getAllCompanies().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openEdit(company: Company): void {
    const ref = this.dialog.open(CompanyEditComponent, {
      width: '420px',
      data: { id: company.id },
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.reloadCompanies();
    });
  }
  openDetails(company: Company): void {
    this.dialog.open(CompanyDetailsComponent, {
      width: '520px',
      data: { id: company.id } as any,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr',
      autoFocus: false
    });
  }

  openDelete(company: Company): void {
    const ref = this.dialog.open(CompanyDeleteComponent, {
      width: '380px',
      data: company,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.reloadCompanies();
    });
  }
}
