import { Component, Inject } from '@angular/core';
import { DirectorateService } from '../../Services/directorate.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Directorate } from '../../Models/directorate';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-delete',

  templateUrl: './delete.component.html',
  styleUrl: '../create/create.component.scss'
})
export class DeleteComponent {

loading = false;

  constructor(
    private DirectorateService: DirectorateService,
    private dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public directorate: Directorate,
    public i18n: I18nService
  ) {}

  confirm(): void {
    this.loading = true;

    this.DirectorateService.deleteDirectorate(this.directorate.id).subscribe({
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
