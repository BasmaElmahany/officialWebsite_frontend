import { Component, Inject } from '@angular/core';
import { NewsTypeService } from '../../Services/news-type.service';
import { DeleteComponent } from '../delete/delete.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { NewsTypes } from '../../Models/newTypes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
 form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: NewsTypeService,
    private dialogRef: MatDialogRef<CreateComponent>,
    public i18n: I18nService
  ) {
    this.form = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    this.service.createNewsType(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true); // ✅ success
      },
      error: () => this.loading = false
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
