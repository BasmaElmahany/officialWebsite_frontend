import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { socialSocieties } from '../../Models/society';
import { CenterService } from '../../Services/society.service';

@Component({
  selector: 'app-details',

  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  loading = true;
  society?: socialSocieties;

  constructor(
    private societyService: CenterService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: socialSocieties,
    public i18n: I18nService
  ) {
    // ✅ Always re-fetch by id to ensure you have the latest/full entity
    const id = (data as any)?.id;

    if (!id) {
      this.loading = false;
      this.society = data;
      return;
    }

    this.societyService.getById(id).subscribe({
      next: (c) => {
        console.log('API Response:', c); // Log the API response
        this.society = c;
        const raw = c as any;

        c.dirPhotoUrl = this.getDirPhotoUrl(
          raw.dirPhotoUrl ?? raw.dirphotoUrl
        );// Assign the API response to the `society` property
        console.log('Society Data:', this.society); // Verify the assignment
        console.log('Society DirPhotoUrl:', this.society?.dirPhotoUrl); // Verify the `dirPhotoUrl`
        this.loading = false;
      },
      error: () => {
        // Fallback to passed data if API fails
        this.society = this.data;
        console.log('Fallback Data:', this.society); // Log fallback data
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    console.log('Society Data:', this.society);
    console.log('Society DirPhotoUrl:', this.society?.dirPhotoUrl);
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
