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
    @Inject(MAT_DIALOG_DATA) public data: Agency,
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
        console.log('API Response:', c); // Log the API response
        this.agency = c;
        const raw = c as any;

        c.dirPhotoUrl = this.getDirPhotoUrl(
          raw.dirPhotoUrl ?? raw.dirphotoUrl
        );// Assign the API response to the `agency` property
        console.log('Agency Data:', this.agency); // Verify the assignment
        console.log('Agency DirPhotoUrl:', this.agency?.dirPhotoUrl); // Verify the `dirPhotoUrl`
        this.loading = false;
      },
      error: () => {
        // Fallback to passed data if API fails
        this.agency = this.data;
        console.log('Fallback Data:', this.agency); // Log fallback data
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    console.log('Agency Data:', this.agency);
    console.log('Agency DirPhotoUrl:', this.agency?.dirPhotoUrl);
  }

  getPhotoUrl(photoData?: string | { fileName: string }): string {
    if (!photoData) return '';
    if (typeof photoData === 'string') {
      if (photoData.startsWith('http')) return photoData;
      return 'https://shusha.minya.gov.eg:93' + photoData;
    }
    // Construct URL using fileName
    return `https://shusha.minya.gov.eg:93${photoData.fileName}`;
  }

  getDirPhotoUrl(dirphotoUrl?: string | { fileName: string }): string {
    if (!dirphotoUrl) return '';
    if (typeof dirphotoUrl === 'string') {
      if (dirphotoUrl.startsWith('http')) return dirphotoUrl;
      return 'https://shusha.minya.gov.eg:93' + dirphotoUrl; // Prepend base URL
    }
    // Construct URL using fileName
    return `https://shusha.minya.gov.eg:93${dirphotoUrl.fileName}`;
  }
}