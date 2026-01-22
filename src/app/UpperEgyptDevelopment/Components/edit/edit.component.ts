import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { CenterList } from '../../../Center/Models/center';
import { CenterService } from '../../../Center/Services/center.service';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { UpperDevService } from '../../Services/upper-dev.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {

  form!: FormGroup;
  loading = false;

  centersList: CenterList[] = [];

  selectedFile?: File;
  pdfPreview?: SafeResourceUrl;

  fileName ?= '';
  fileSize = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,   // 👈 id comes here
    private dialogRef: MatDialogRef<EditComponent>,
    private service: UpperDevService,
    private centerService: CenterService,
    public i18n: I18nService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

    this.buildForm();
    this.loadCenters();
    this.loadDetails();
  }

  buildForm() {
    this.form = this.fb.group({
      centerId: ['', Validators.required],
      titleAr: ['', Validators.required],
      titleEn: ['', Validators.required]
    });
  }

  /* ===== Load Existing Data ===== */
  loadDetails() {

    this.service.getbyId(this.data.id).subscribe(res => {

      const d = res;

      this.form.patchValue({
        centerId: d.centerId,
        titleAr: d.titleAr,
        titleEn: d.titleEn
      });

      // Existing file
      if (d.fileUrl) {
        this.fileName = d.fileUrl.split('/').pop();

        this.pdfPreview =
          this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://shusha.minya.gov.eg:93' + d.fileUrl
          );
      }
    });
  }

  /* ===== Load Centers ===== */
  loadCenters() {
    this.centerService.getListCenters().subscribe(res => {
      this.centersList = res;
    });
  }

  /* ===== Select New PDF ===== */
  onPdfSelected(event: Event) {

    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (file.type !== 'application/pdf') {
      alert('PDF only');
      return;
    }

    this.selectedFile = file;

    this.fileName = file.name;
    this.fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';

    const reader = new FileReader();
    reader.onload = () => {
      this.pdfPreview =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          reader.result as string
        );
    };

    reader.readAsDataURL(file);
  }

  /* ===== Update ===== */
  submit() {

    if (this.form.invalid) return;

    this.loading = true;

    const fd = new FormData();

    fd.append('centerId', this.form.value.centerId);
    fd.append('titleAr', this.form.value.titleAr);
    fd.append('titleEn', this.form.value.titleEn);

    // attach file ONLY if changed
    if (this.selectedFile) {
      fd.append('file', this.selectedFile);
    }

    this.service.update(this.data.id, fd).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }

}