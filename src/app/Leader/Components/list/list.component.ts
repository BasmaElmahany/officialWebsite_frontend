import { I18nService } from '../../../Shared/Services/i18n.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { LeaderService } from '../../Services/leader.service';
import { Leader } from '../../Models/leader';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { DetailsComponent } from '../details/details.component';
import { EditComponent } from '../edit/edit.component';
import { DeleteComponent } from '../delete/delete.component';

@Component({
  selector: 'app-leader-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit {
  constructor(
    private leaderService: LeaderService,
    private router: Router,
    private dialog: MatDialog,
    public i18n: I18nService
  ) {}
  displayedColumns: string[] = ['name', 'photo', 'position', 'isEnded', 'actions'];
  dataSource = new MatTableDataSource<Leader>();
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadLeaders();
    this.dataSource.filterPredicate = (leader, filter) => {
      return !!(leader.nameAr && leader.nameAr.toLowerCase().includes(filter));
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadLeaders(): void {
    this.loading = true;
    this.leaderService.getLeaders().subscribe({
      next: (res: { msg: string; data: Leader[] }) => {
        this.dataSource.data = res.data || [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to fetch leaders', err);
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  goToCreate(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '420px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLeaders();
      }
    });
  }

  openEdit(leader: Leader): void {
    const ref = this.dialog.open(EditComponent, {
      width: '420px',
      data: leader
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.loadLeaders();
    });
  }

  openDetails(leader: Leader): void {
    this.dialog.open(
      DetailsComponent,
      {
        width: '420px',
        data: { id: leader.id }
      }
    );
  }

  openDelete(leader: Leader): void {
    const ref = this.dialog.open(DeleteComponent, {
      width: '400px',
      data: leader
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.loadLeaders();
    });
  }
}
