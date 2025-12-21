import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { Center } from '../../Models/center';
import { CenterService } from '../../Services/center.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-details',

  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
    loading = true;
  center?: Center;

  constructor(
    private centerService: CenterService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Center,
    public i18n: I18nService
  ) {
    // ✅ Always re-fetch by id to ensure you have the latest/full entity
    const id = (data as any)?.id;

    if (!id) {
      this.loading = false;
      this.center = data;
      return;
    }

    this.centerService.getbyId(id).subscribe({
      next: (c) => {
        this.center = c;
        this.loading = false;
      },
      error: () => {
        // fallback to passed data if API fails
        this.center = data;
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
