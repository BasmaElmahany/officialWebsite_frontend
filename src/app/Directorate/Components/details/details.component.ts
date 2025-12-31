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
        console.log('API Response:', c); // Log the API response
        this.directorate = c; // Assign the API response to the `directorate` property
        console.log('Directorate Data:', this.directorate); // Verify the assignment
        console.log('Directorate DirPhotoUrl:', this.directorate?.dirPhotoUrl); // Verify the `dirPhotoUrl`
        this.loading = false;
      },
      error: () => {
        // Fallback to passed data if API fails
        this.directorate = this.data;
        console.log('Fallback Data:', this.directorate); // Log fallback data
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    console.log('Directorate Data:', this.directorate);
    console.log('Directorate DirPhotoUrl:', this.directorate?.dirPhotoUrl);
  }

  getPhotoUrl(photoData?: string | { fileName: string }): string {
    if (!photoData) return '';
    if (typeof photoData === 'string') {
      if (photoData.startsWith('http')) return photoData;
      return 'https://shusha.minya.gov.eg:93'+ photoData;
    }
    // Construct URL using fileName
    return `https://shusha.minya.gov.eg:93${photoData.fileName}`;
  }

  getDirPhotoUrl(dirPhotoData?: string | { fileName: string }): string {
    if (!dirPhotoData) return '';
    if (typeof dirPhotoData === 'string') {
      if (dirPhotoData.startsWith('http')) return dirPhotoData;
      return 'https://shusha.minya.gov.eg:93' + dirPhotoData; // Prepend base URL
    }
    // Construct URL using fileName
    return `https://shusha.minya.gov.eg:93${dirPhotoData.fileName}`;
  }
}
