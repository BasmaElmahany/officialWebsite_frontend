import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GovtoursService } from '../../Services/govtours.service';
import { MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-create',

  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  form: FormGroup;
  loading = false;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  constructor(
    private fb: FormBuilder,
    private govToursService: GovtoursService,
    private dialogRef: MatDialogRef<CreateComponent>,
    public i18n: I18nService
  ) {
    this.form = this.fb.group({
      date: ['', Validators.required],
      titleAr: ['', Validators.required],
      titleEn: ['', Validators.required],
      articleAr: ['', Validators.required],
      articleEn: ['', Validators.required],
      sourceAr: [''],
      sourceEn: ['']
    });
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
    this.govToursService.create(payload).subscribe({
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
