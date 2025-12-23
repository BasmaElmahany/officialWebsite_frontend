
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../../Services/company.service';
import { Company } from '../../Models/company';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CompanyCreateComponent } from '../create/company-create.component';
import { CompanyEditComponent } from '../edit/company-edit.component';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { CompanyDetailsComponent } from '../details/company-details.component';
import { CompanyDeleteComponent } from '../delete/company-delete.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<Company>();
  loading = true;
  error = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private companyService: CompanyService,
    public i18n: I18nService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCompanies();

    // Sorting based on language
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'name') {
        return this.i18n.currentLang === 'ar' ? item.nameAr : item.nameEn;
      }
      return '';
    };

    // Filtering based on language
    this.dataSource.filterPredicate = (company, filter) => {
      const value = this.i18n.currentLang === 'ar' ? company.nameAr : company.nameEn;
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
    return this.i18n.currentLang === 'ar' ? company.nameAr : company.nameEn;
  }

  goToCreate(): void {
    const dialogRef = this.dialog.open(CompanyCreateComponent, {
      width: '420px',
      disableClose: true,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCompanies();
      }
    });
  }

  // Placeholder for edit, details, delete
  openEdit(company: Company): void {
    const ref = this.dialog.open(CompanyEditComponent, {
      width: '420px',
      data: company,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.loadCompanies();
    });
  }
  openDetails(company: Company): void {
    this.dialog.open(CompanyDetailsComponent, {
      width: '420px',
      data: { ...company },
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });
  }
  openDelete(company: Company): void {
    const ref = this.dialog.open(CompanyDeleteComponent, {
      width: '380px',
      data: { id: company.id, nameAr: company.nameAr, nameEn: company.nameEn },
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.loadCompanies();
    });
  }

  private loadCompanies(): void {
    this.loading = true;
    this.companyService.getCompanies().subscribe({
      next: (res) => {
        this.dataSource.data = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load companies.';
        this.loading = false;
      }
    });
  }
}
