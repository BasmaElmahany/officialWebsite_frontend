import { Component, Inject } from '@angular/core';
import { VideoRead } from '../../Models/video';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VideoService } from '../../Services/video.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {

  form: FormGroup;
  loading = false;
  selectedVideo!: File;
  videoPreview!: string;

  constructor(
    private fb: FormBuilder,
    private service: VideoService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VideoRead,
    public i18n: I18nService
  ) {

    this.form = this.fb.group({
      Id: [''],
      date: ['', Validators.required],
      TitleAr: ['', Validators.required],
      TitleEn: ['', Validators.required],
      ArticleAr: [''],
      ArticleEn: [''],
      SourceAr: [''],
      SourceEn: ['']
    });

    this.patchForm(data);
  }

  /* ===== PATCH DATA ===== */
  private patchForm(video: any): void {

    this.form.patchValue({
      Id: video.id,
      date: new Date(video.date),
      TitleAr: video.titleAr,
      TitleEn: video.titleEn,
      ArticleAr: video.articleAr,
      ArticleEn: video.articleEn,
      SourceAr: video.sourceAr || '',
      SourceEn: video.sourceEn || ''

    });

    // existing video preview
    if (video.videoUrl) {
      this.videoPreview = this.getVideoUrl(video.videoUrl);
    }
  }

  /* ===== SELECT NEW VIDEO ===== */
  onVideoSelected(event: Event): void {

    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedVideo = input.files[0];

    // preview new video
    this.videoPreview = URL.createObjectURL(this.selectedVideo);
  }

  /* ===== SUBMIT ===== */
  submit(): void {

    if (this.form.invalid) return;
    this.loading = true;

    const fd = new FormData();

    fd.append('Id', this.data.id);
    fd.append('TitleAr', this.form.value.TitleAr);
    fd.append('TitleEn', this.form.value.TitleEn);
    fd.append('ArticleAr', this.form.value.ArticleAr || '');
    fd.append('ArticleEn', this.form.value.ArticleEn || '');
    fd.append('SourceAr', this.form.value.SourceAr || '');
    fd.append('SourceEn', this.form.value.SourceEn || '');

    // convert date to yyyy-MM-dd (DateOnly)
    const d = new Date(this.form.value.date);
    const formatted =
      d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');

    fd.append('Date', formatted);

    // IMPORTANT: backend expects videoUrl
    if (this.selectedVideo) {
      fd.append('videoUrl', this.selectedVideo);
    }

  

    this.service.updateVideo(this.data.id, fd).subscribe({
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

  getVideoUrl(url: string): string {
    return `https://shusha.minya.gov.eg:93${url}`;
  }
}
