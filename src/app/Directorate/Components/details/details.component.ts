import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { Directorate } from '../../Models/directorate';
import { DirectorateService } from '../../Services/directorate.service';

@Component({
  selector: 'app-details',

  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
loading = true;
  directorate?: Directorate;

  constructor(
    private directorateService: DirectorateService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Directorate,
    public i18n: I18nService
  ) {
    // ✅ Always re-fetch by id to ensure you have the latest/full entity
    const id = (data as any)?.id;

    if (!id) {
      this.loading = false;
      this.directorate = data;
      return;
    }

    this.directorateService.getbyId(id).subscribe({
      next: (c) => {
        this.directorate = c;
        this.loading = false;
      },
      error: () => {
        // fallback to passed data if API fails
        this.directorate = data;
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
