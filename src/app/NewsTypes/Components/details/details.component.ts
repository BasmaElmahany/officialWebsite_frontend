import { Component, Inject } from '@angular/core';
import { NewsTypes } from '../../Models/newTypes';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewsTypeService } from '../../Services/news-type.service';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  loading = true;
  NewsTypes?: NewsTypes;

  constructor(
    private Service: NewsTypeService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewsTypes,
    public i18n: I18nService
  ) {
    // ✅ Always re-fetch by id to ensure you have the latest/full entity
    const id = (data as any)?.id;

    if (!id) {
      this.loading = false;
      this.NewsTypes = data;
      return;
    }

    this.Service.getbyId(id).subscribe({
      next: (c) => {
        this.NewsTypes = c;
        this.loading = false;
      },
      error: () => {
        // fallback to passed data if API fails
        this.NewsTypes = data;
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
