import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { VideoService } from '../../Services/video.service';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create',

  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  form: FormGroup;
  loading = false;
  selectedVideo!: File;
  videoPreview!: string;

  constructor(
    private fb: FormBuilder,
    private service: VideoService,
    private dialogRef: MatDialogRef<CreateComponent>,
    public i18n: I18nService
  ) {
    this.form = this.fb.group({
      date: ['', Validators.required],
      TitleAr: ['', Validators.required],
      TitleEn: ['', Validators.required],
      ArticleAr: [''],
      ArticleEn: [''],
      SourceAr: [''],
      SourceEn: ['']
    });
  }

  /* ===== Select Video ===== */
  onVideoSelected(event: Event): void {

    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedVideo = input.files[0];

    /* Preview */
    this.videoPreview = URL.createObjectURL(this.selectedVideo);
  }

  /* ===== Submit ===== */
  submit(): void {

    if (this.form.invalid || !this.selectedVideo) return;

    this.loading = true;

    const formData = new FormData();

    const d = new Date(this.form.value.date);


    formData.append('TitleAr', this.form.value.TitleAr);
    formData.append('TitleEn', this.form.value.TitleEn);
    formData.append('ArticleAr', this.form.value.ArticleAr || '');
    formData.append('ArticleEn', this.form.value.ArticleEn || '');
    formData.append('SourceAr', this.form.value.SourceAr || '');
    formData.append('SourceEn', this.form.value.SourceEn || '');
    formData.append('Date', d.toISOString().split('T')[0]);
    formData.append('videoUrl', this.selectedVideo);

    /* DEBUG */
    (formData as any).forEach((v: any, k: string) => {
      console.log(k, v);
    });

    this.service.createVideo(formData).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }



}
