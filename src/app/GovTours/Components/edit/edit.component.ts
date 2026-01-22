import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { GetGovTours } from '../../Models/govTours';
import { GovtoursService } from '../../Services/govtours.service';

@Component({
  selector: 'app-edit',

  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {

  form: FormGroup;
  loading = false;

  selectedFiles: File[] = [];
  existingPhotos: { id: number; photoUrl: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private govToursService: GovtoursService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GetGovTours,
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

    this.patchForm(data);
  }

  private patchForm(tour: GetGovTours): void {
    this.form.patchValue({
      date: tour.date,
      titleAr: tour.titleAr,
      titleEn: tour.titleEn,
      articleAr: tour.articleAr,
      articleEn: tour.articleEn,
      sourceAr: tour.sourceAr,
      sourceEn: tour.sourceEn
    });

    this.existingPhotos = tour.photos ?? [];
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
    this.govToursService.update(this.data.id, payload).subscribe({
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
}
