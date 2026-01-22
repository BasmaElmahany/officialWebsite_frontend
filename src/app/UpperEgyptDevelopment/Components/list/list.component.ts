import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UpperEgyptDevelopmentRead } from '../../Models/upperDev';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CenterService } from '../../../Center/Services/center.service';
import { UpperDevService } from '../../Services/upper-dev.service';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Center, CenterList } from '../../../Center/Models/center';
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

  displayedColumns: string[] = ['icon', 'name', 'center', 'actions'];
  dataSource = new MatTableDataSource<UpperEgyptDevelopmentRead>();
  loading = true;
  centersList: CenterList[] = [];

  centerMap: Record<string, CenterList> = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private centerService: CenterService, private service: UpperDevService,
    private router: Router,
    public i18n: I18nService, private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.centerService.getListCenters().subscribe({
      next: data => {
        this.centersList = data;
        console.log(data);
        this.loading = false;
         data.forEach(c => {
          this.centerMap[c.id] = c;
        });
      },
      error: () => this.loading = false
    });
    this.service.getAll().subscribe({
      next: data => {
        this.dataSource.data = data;
        console.log(data);
        this.loading = false;
       
      },
      error: () => this.loading = false
    });
    // 🔥 Sorting based on language
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'name') {
        return this.i18n.currentLang === 'ar'
          ? item.titleAr
          : item.titleEn;
      }
      return '';
    };

    // 🔎 Filtering based on language
    this.dataSource.filterPredicate = (item, filter) => {
      const value = this.i18n.currentLang === 'ar'
        ? item.titleAr
        : item.titleEn;
      return value.toLowerCase().includes(filter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

 mapCenterName(centerId: string): string {

  const c = this.centerMap[centerId];
  if (!c) return '';

  return this.i18n.currentLang === 'ar'
   ? c.nameAr
   : c.nameEn;
}

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  getTitle(item: UpperEgyptDevelopmentRead): string {
    return this.i18n.currentLang === 'ar'
      ? item.titleAr
      : item.titleEn;
  }


  goToCreate(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '420px',
      disableClose: true,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reloadData();
      }
    });
  }


  reloadData(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openEdit(center: Center): void {
    const ref = this.dialog.open(EditComponent, {
      width: '420px',
      data: center,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.reloadData();
    });
  }
  openDetails(center: Center): void {
    this.dialog.open(DetailsComponent, {
      width: '520px',
      data: { id: center.id } as any,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr',
      autoFocus: false
    });
  }

  openDelete(center: Center): void {
    const ref = this.dialog.open(DeleteComponent, {
      width: '380px',
      data: center,
      direction: this.i18n.isRTL ? 'rtl' : 'ltr'
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.reloadData();
    });
  }

}

