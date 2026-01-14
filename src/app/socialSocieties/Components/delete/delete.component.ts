import { Component, Inject } from '@angular/core';
import { CenterService } from '../../Services/society.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { socialSocieties } from '../../Models/society';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-delete',

  templateUrl: './delete.component.html',
  styleUrl: '../create/create.component.scss'
})
export class DeleteComponent {

loading = false;

  constructor(
    private societyService: CenterService,
    private dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public society: socialSocieties,
    public i18n: I18nService
  ) {}

  confirm(): void {
    this.loading = true;

    this.societyService.deleteSocialSocieties(this.society.id).subscribe({
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
