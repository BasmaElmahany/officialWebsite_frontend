import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { NewsService } from '../../Services/news.service';
import { NewsTypeService } from '../../../NewsTypes/Services/news-type.service';
import { NewsTypes } from '../../../NewsTypes/Models/newTypes';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  form: FormGroup;
  loading = false;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  newsTypes: NewsTypes[] = [];
  constructor(
    private fb: FormBuilder,
    private service: NewsService, private typeService: NewsTypeService,
    private dialogRef: MatDialogRef<CreateComponent>,
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
  }
  ngOnInit(): void {
    this.LoadTypes();
  }
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFiles = Array.from(input.files);

    // reset previews
    this.imagePreviews = [];

    this.selectedFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      this.imagePreviews.push(url);
    });
  }
  submit(): void {
    if (this.form.invalid) return;

    console.log(this.form.value);
    this.loading = true;

    const payload = {
      ...this.form.value,
      photos: this.selectedFiles
    };
    console.log(payload);
    this.service.create(payload).subscribe({
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