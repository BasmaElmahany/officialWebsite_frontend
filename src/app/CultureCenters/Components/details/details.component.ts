import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { CultureCenter } from '../../Models/Center';
import { CenterService } from '../../Services/center.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  loading = true;
  center?: CultureCenter;

  constructor(
    private centerService: CenterService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    const id = this.data?.id;
    if (!id) {
      this.loading = false;
      return;
    }

    // تحديد نوع res و err يدوياً لحل أخطاء الـ compiler
    this.centerService.getById(id).subscribe({
      next: (res: CultureCenter) => {
        this.center = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching details:', err);
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  formatImageUrl(url?: string): string {
    if (!url) return 'assets/images/default-placeholder.png';
    if (url.startsWith('http')) return url;
    return `https://shusha.minya.gov.eg:93${url.startsWith('/') ? '' : '/'}${url}`;
  }
}