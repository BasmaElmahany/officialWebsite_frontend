import { Component, Inject } from '@angular/core';
import { CenterService } from '../../Services/center.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CultureCenter } from '../../Models/Center';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
selector: 'app-center-create',

  templateUrl: './delete.component.html',
  styleUrl: '../create/create.component.scss'
})
export class DeleteComponent {

loading = false;

  constructor(
    private centerService: CenterService,
    private dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public society: CultureCenter,
    public i18n: I18nService
  ) {}

  confirm(): void {
    this.loading = true;

    this.centerService.delete(this.society.id).subscribe({
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
