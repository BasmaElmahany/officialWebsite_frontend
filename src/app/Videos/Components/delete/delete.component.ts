import { Component, Inject } from '@angular/core';
import { VideoRead } from '../../Models/video';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VideoService } from '../../Services/video.service';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-delete',

  templateUrl: './delete.component.html',
  styleUrl: '../create/create.component.scss'
})
export class DeleteComponent {
 loading = false;

  constructor(
    private service: VideoService,
    public i18n: I18nService,
    private dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public video: VideoRead,
  ) { }

  confirm(): void {
    this.loading = true;

    this.service.deleteVideo(this.video.id).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: () => this.loading = false
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
