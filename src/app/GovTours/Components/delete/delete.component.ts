import { Component, Inject } from '@angular/core';
import { GovtoursService } from '../../Services/govtours.service';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GetGovTours } from '../../Models/govTours';

@Component({
  selector: 'app-delete',

  templateUrl: './delete.component.html',
  styleUrl: '../create/create.component.scss'
})
export class DeleteComponent {

  loading = false;

  constructor(
    private govToursService: GovtoursService,
    public i18n: I18nService,
    private dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public tour: GetGovTours,
  ) { }

  confirm(): void {
    this.loading = true;

    this.govToursService.delete(this.tour.id).subscribe({
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
