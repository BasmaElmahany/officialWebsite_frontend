import { Component, Inject, OnInit } from '@angular/core';
import { VideoRead } from '../../Models/video';
import { VideoService } from '../../Services/video.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-details',

  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {

  loading = true;
  video!: VideoRead;

  constructor(
    private service: VideoService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.loadDetails();
  }

  private loadDetails(): void {
    this.loading = true;

    this.service.getbyId(this.data.id).subscribe({
      next: res => {
        this.video = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  getVideoUrl(url: string): string {
    return `https://shusha.minya.gov.eg:93${url}`;
  }
}