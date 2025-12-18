import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CenterService } from '../../Services/center.service';
import { Router } from '@angular/router';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { MatDialogRef } from '@angular/material/dialog';

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
    private centerService: CenterService,
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

    this.centerService.createCenter(this.form.value).subscribe({
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