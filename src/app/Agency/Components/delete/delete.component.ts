import { Component, Inject } from '@angular/core';
import { AgncyService } from '../../Services/agncy.service';
import { Agency } from '../../Models/agency';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-delete',

  templateUrl: './delete.component.html',
  styleUrl: '../create/create.component.scss'
})
export class DeleteComponent {
  loading = false;

  constructor(
    private agencyService: AgncyService,
    private dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public agency: Agency,
    public i18n: I18nService
  ) { }

  confirm(): void {
    this.loading = true;

    this.agencyService.deleteAgency(this.agency.id).subscribe({
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
