import { Component, Inject } from '@angular/core';
import { NewsTypeService } from '../../Services/news-type.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { NewsTypes } from '../../Models/newTypes';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrl: '../create/create.component.scss'
})
export class DeleteComponent {
loading = false;

  constructor(
    private service: NewsTypeService,
    private dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public newstypes: NewsTypes,
    public i18n: I18nService
  ) { }

  confirm(): void {
    this.loading = true;

    this.service.deleteNewsType(this.newstypes.id).subscribe({
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
