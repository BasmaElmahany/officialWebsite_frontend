import { Component, Inject } from '@angular/core';
import { AgncyService } from '../../Services/agncy.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { Agency } from '../../Models/agency';

@Component({
  selector: 'app-details',

  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
loading = true;
  agency?: Agency;

  constructor(
    private agencyService: AgncyService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Agency ,
    public i18n: I18nService
  ) {
    // ✅ Always re-fetch by id to ensure you have the latest/full entity
    const id = (data as any)?.id;

    if (!id) {
      this.loading = false;
      this.agency = data;
      return;
    }

    this.agencyService.getbyId(id).subscribe({
      next: (c) => {
        this.agency = c;
        this.loading = false;
      },
      error: () => {
        // fallback to passed data if API fails
        this.agency = data;
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
