import { Component, Inject } from '@angular/core';
import { NewsService } from '../../Services/news.service';
import { GetNews } from '../../Models/news';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrl: '../create/create.component.scss'
})
export class DeleteComponent {
loading = false;

  constructor(
    private service: NewsService,
    public i18n: I18nService,
    private dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public tour: GetNews,
  ) { }

  confirm(): void {
    this.loading = true;

    this.service.delete(this.tour.id).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: () => this.loading = false
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
