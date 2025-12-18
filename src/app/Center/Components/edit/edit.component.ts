import { Component, Inject } from '@angular/core';
import { CenterService } from '../../Services/center.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { Center, CreateCenter } from '../../Models/center';

@Component({
  selector: 'app-edit',

  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  loading = false;

  form = this.fb.group({
    nameAr: ['', Validators.required],
    nameEn: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private centerService: CenterService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public center: Center,
    public i18n: I18nService
  ) {
    this.form.patchValue(center);
  }

submit(): void {
  if (this.form.invalid) return;

  this.loading = true;

  const payload: CreateCenter = {
    nameAr: this.form.get('nameAr')!.value!,
    nameEn: this.form.get('nameEn')!.value!
  };

  this.centerService
    .updateCenter(this.center.id, payload)
    .subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: () => (this.loading = false)
    });
}


  close(): void {
    this.dialogRef.close(false);
  }

}
