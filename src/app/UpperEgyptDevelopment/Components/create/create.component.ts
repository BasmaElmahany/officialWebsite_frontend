import { Component, OnInit } from '@angular/core';
import { CenterService } from '../../../Center/Services/center.service';
import { UpperDevService } from '../../Services/upper-dev.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CenterList } from '../../../Center/Models/center';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  form: FormGroup;
  loading = false;
  centersList: CenterList[] = [];
  selectedFile!: File;
  FilePreview!: string;

  pdfPreview!: SafeResourceUrl;   // 🔥 change type

  fileName = '';
  fileSize = '';
  constructor(
    private centerService: CenterService, private service: UpperDevService,
    private router: Router,
    public i18n: I18nService, private fb: FormBuilder, private dialogRef: MatDialogRef<CreateComponent>, private sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      centerId: [''],
      titleAr: ['', Validators.required],
      titleEn: ['', Validators.required],
      pdfFile: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.Loadcenters();
  }

  /* ===== Select Video ===== */
  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFile = input.files[0];

    /* Preview */
    this.FilePreview = URL.createObjectURL(this.selectedFile);
  }
  onPdfSelected(event: Event): void {

    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (file.type !== 'application/pdf') {
      alert('Please upload PDF file only');
      return;
    }

    // 🔥 أهم سطر ناقص
    this.selectedFile = file;

    // set form control (اختياري لكنه احترافي)
    this.form.patchValue({
      pdfFile: file
    });

    this.fileName = file.name;
    this.fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      this.pdfPreview =
        this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    };

    reader.readAsDataURL(file);
  }

  /* ===== Submit ===== */
  submit(): void {

    if (this.form.invalid || !this.selectedFile) {
      return;
    }

    this.loading = true;

    const formData = new FormData();

    /* ===== basic fields (dynamic) ===== */
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (key !== 'pdfFile' && value != null) {
        formData.append(key, String(value));
      }
    });

    /* ===== file ===== */
    if (this.selectedFile) {
      formData.append('fileUrl', this.selectedFile); // ✔ نفس اسم DTO

    }

    /* ===== DEBUG LOG (same style) ===== */
    console.group('📦 UpperDev FormData Payload');

    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(key, {
          fileName: value.name,
          fileType: value.type,
          fileSize: value.size
        });
      } else {
        console.log(key, value);
      }
    });

    console.groupEnd();

    /* ===== API ===== */
    this.service.create(formData).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
      }
    });
  }


  close(): void {
    this.dialogRef.close(false);
  }

  Loadcenters(): void {
    this.centerService.getListCenters().subscribe({
      next: data => {
        this.centersList = data;
      },
      error: () => {
        this.centersList = [];
      }
    });
  }


  getCentersName(centers: CenterList): string {
    return this.i18n.currentLang === 'ar'
      ? centers.nameAr
      : centers.nameEn;
  }

}
