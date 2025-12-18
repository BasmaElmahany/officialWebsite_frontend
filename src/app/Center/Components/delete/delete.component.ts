import { Component, Inject } from '@angular/core';
import { CenterService } from '../../Services/center.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { Center } from '../../Models/center';

@Component({
  selector: 'app-delete',

  templateUrl: './delete.component.html',
   styleUrl: '../create/create.component.scss'
})
export class DeleteComponent {
loading = false;

  constructor(
    private centerService: CenterService,
    private dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public center: Center,
    public i18n: I18nService
  ) {}

  confirm(): void {
    this.loading = true;

    this.centerService.deleteCenter(this.center.id).subscribe({
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
