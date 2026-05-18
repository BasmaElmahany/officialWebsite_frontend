import { Component, Inject, OnInit } from '@angular/core'; // Added OnInit
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { socialSocieties } from '../../Models/society';
import { CenterService } from '../../Services/society.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit { // Best practice to implement OnInit
  loading = true;
  society?: socialSocieties;

  constructor(
    private societyService: CenterService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: socialSocieties,
    public i18n: I18nService
  ) {
    const id = (data as any)?.id;

    if (!id) {
      this.loading = false;
      this.society = data;
      return;
    }

    this.societyService.getById(id).subscribe({
      next: (c) => {
        this.society = c;
        const raw = c as any;
        
        // Use the method existing inside this class
        this.society.dirPhotoUrl = this.getDirPhotoUrl(raw.dirPhotoUrl ?? raw.dirphotoUrl);
        this.loading = false;
      },
      error: () => {
        this.society = this.data;
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    console.log('Society Data:', this.society);
  }

  close(): void {
    this.dialogRef.close(false);
  }

  // Helpers inside the class are correct:
  getPhotoUrl(photoData?: string | { fileName: string }): string {
    if (!photoData) return '';
    if (typeof photoData === 'string') {
      return photoData.startsWith('http') ? photoData : `https://shusha.minya.gov.eg:93${photoData}`;
    }
    return `https://shusha.minya.gov.eg:93${photoData.fileName}`;
  }

  getDirPhotoUrl(dirphotoUrl?: string | { fileName: string }): string {
    if (!dirphotoUrl) return '';
    if (typeof dirphotoUrl === 'string') {
      return dirphotoUrl.startsWith('http') ? dirphotoUrl : `https://shusha.minya.gov.eg:93${dirphotoUrl}`;
    }
    return `https://shusha.minya.gov.eg:93${dirphotoUrl.fileName}`;
  }

  getServiceFileUrl(file?: string): string {
    if (!file) return '';
    return file.startsWith('http') ? file : `https://shusha.minya.gov.eg:93${file}`;
  }
}