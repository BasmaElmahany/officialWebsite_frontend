import { Component, Inject } from '@angular/core';
import { GetGovTours } from '../../Models/govTours';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { GovtoursService } from '../../Services/govtours.service';

@Component({
  selector: 'app-details',

  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
 loading = true;
  tour?: GetGovTours;

  constructor(
    private govToursService: GovtoursService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GetGovTours,
    public i18n: I18nService
  ) {
    // ✅ Always re-fetch by id to ensure you have the latest/full entity
    const id = (data as any)?.id;

    if (!id) {
      this.loading = false;
      this.tour = data;
      return;
    }

    this.govToursService.getById(id).subscribe({
      next: (c) => {
        this.tour = c.data;
        this.loading = false;
      },
      error: () => {
        // fallback to passed data if API fails
        this.tour = data;
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
