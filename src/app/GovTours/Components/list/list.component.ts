import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GetGovTours } from '../../Models/govTours';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GovtoursService } from '../../Services/govtours.service';
import { I18nService } from '../../../Shared/Services/i18n.service';
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

  displayedColumns: string[] = ['image', 'title', 'date', 'actions'];
  dataSource = new MatTableDataSource<GetGovTours>();
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private govToursService: GovtoursService,
    public i18n: I18nService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTours();

    // Sorting حسب اللغة
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'title') {
        return this.i18n.currentLang === 'ar'
          ? item.titleAr
          : item.titleEn;
      }
      if (property === 'date') {
        return item.date;
      }
      return '';
    };

    // Filter حسب اللغة
    this.dataSource.filterPredicate = (tour, filter) => {
      const value = this.i18n.currentLang === 'ar'
        ? tour.titleAr
        : tour.titleEn;

      return value.toLowerCase().includes(filter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  loadTours(): void {
    this.loading = true;

    this.govToursService.getAll().subscribe({
      next: res => {
        this.dataSource.data = res.data; // ✅ هنا التصحيح
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

  getTitle(tour: GetGovTours): string {
    return this.i18n.currentLang === 'ar'
      ? tour.titleAr
      : tour.titleEn;
  }

  getCoverImage(tour: GetGovTours): string {
    if (!tour.photos?.length) {
      return 'assets/images/placeholder.jpg';
    }
    return `https://shusha.minya.gov.eg:93${tour.photos[0].photoUrl}`;
  }

  openCreate(): void {
    const ref = this.dialog.open(CreateComponent, {
      width: '460px',
      disableClose: true,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.loadTours();
      }
    });
  }
  openEdit(tour: GetGovTours): void {
     const ref = this.dialog.open(EditComponent, {
       width: '420px',
       data: tour,
       direction: this.i18n.isRTL ? 'rtl' : 'ltr'
     });
 
     ref.afterClosed().subscribe(ok => {
       if (ok) this.loadTours();
     });
   }
   openDetails(tour: GetGovTours): void {
     this.dialog.open(DetailsComponent, {
       width: '520px',
       data: { id: tour.id } as any,
       direction: this.i18n.isRTL ? 'rtl' : 'ltr',
       autoFocus: false
     });
   }
 
   openDelete(tour: GetGovTours): void {
     const ref = this.dialog.open(DeleteComponent, {
       width: '380px',
       data: tour,
       direction: this.i18n.isRTL ? 'rtl' : 'ltr'
     });
 
     ref.afterClosed().subscribe(ok => {
       if (ok) this.loadTours();
     });
   } 

}