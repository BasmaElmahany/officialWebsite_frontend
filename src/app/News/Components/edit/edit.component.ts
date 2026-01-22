import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsService } from '../../Services/news.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GetNews } from '../../Models/news';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { NewsTypes } from '../../../NewsTypes/Models/newTypes';
import { NewsTypeService } from '../../../NewsTypes/Services/news-type.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {

  form: FormGroup;
  loading = false;
  newsTypes: NewsTypes[] = [];
  selectedFiles: File[] = [];
  existingPhotos: { id: number; photoUrl: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private service: NewsService, private typeService: NewsTypeService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GetNews,
    public i18n: I18nService
  ) {

    this.form = this.fb.group({
      typeId: ['', Validators.required],
      date: ['', Validators.required],
      titleAr: ['', Validators.required],
      titleEn: ['', Validators.required],
      articleAr: ['', Validators.required],
      articleEn: ['', Validators.required],
      sourceAr: [''],
      sourceEn: ['']
    });

    this.patchForm(data);
  }

  ngOnInit(): void {
    this.LoadTypes();
  }

  private patchForm(news: GetNews): void {
    this.form.patchValue({
      typeId: news.typeId,
      date: news.date,
      titleAr: news.titleAr,
      titleEn: news.titleEn,
      articleAr: news.articleAr,
      articleEn: news.articleEn
    });

    this.existingPhotos = news.photos ?? [];
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFiles = Array.from(input.files);
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const payload = {
      ...this.form.value,
      photos: this.selectedFiles   // 🔥 new photos only
    };

    console.log(payload);
    this.service.update(this.data.id, payload).subscribe({
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

  getImageUrl(url: string): string {
    return `https://shusha.minya.gov.eg:93${url}`;
  }
  LoadTypes(): void {
    this.typeService.getAllNewsTypes().subscribe({
      next: data => {
        this.newsTypes = data;
      },
      error: () => {
        this.newsTypes = [];
      }
    });
  }


  getNewsTypeName(newsType: NewsTypes): string {
    return this.i18n.currentLang === 'ar'
      ? newsType.nameAr
      : newsType.nameEn;
  }
}
