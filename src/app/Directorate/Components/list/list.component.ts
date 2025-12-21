import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Directorate } from '../../Models/directorate';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { MatDialog } from '@angular/material/dialog';
import { DirectorateService } from '../../Services/directorate.service';
import { Router } from '@angular/router';
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
  dataSource = new MatTableDataSource<Directorate>();
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private directorateService: DirectorateService,
    private router: Router,
    public i18n: I18nService, private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.directorateService.getAllDirectorates().subscribe({
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
    this.dataSource.filterPredicate = ( directorate, filter) => {
      const value = this.i18n.currentLang === 'ar'
        ? directorate.nameAr
        : directorate.nameEn;
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

  getCenterName(center: Directorate): string {
    return this.i18n.currentLang === 'ar'
      ? center.nameAr
      : center.nameEn;
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
    this.directorateService.getAllDirectorates().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openEdit(directorate: Directorate): void {
    const ref = this.dialog.open(EditComponent, {
      width: '420px',
      data: directorate,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.reloadCenters();
    });
  }
  openDetails(directorate: Directorate): void {
    this.dialog.open(DetailsComponent, {
      width: '520px',
      data: { id: directorate.id } as any,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr',
      autoFocus: false
    });
  }

  openDelete(directorate: Directorate): void {
    const ref = this.dialog.open(DeleteComponent, {
      width: '380px',
      data: directorate,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.reloadCenters();
    });
  } 
}
