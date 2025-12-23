import { Component, Inject } from '@angular/core';
import { Agency, CreateAgency } from '../../Models/agency';
import { FormBuilder, Validators } from '@angular/forms';
import { AgncyService } from '../../Services/agncy.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';

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
    private agncyService: AgncyService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public agency: Agency,
    public i18n: I18nService
  ) {
    this.form.patchValue({
      nameAr: agency.nameAr ?? '',
      nameEn: agency.nameEn ?? ''
    });
  }

  submit(): void {
    if (this.form.invalid || this.loading) return;

    this.loading = true;

    const payload: CreateAgency = {
      nameAr: this.form.get('nameAr')!.value!,
      nameEn: this.form.get('nameEn')!.value!
    };

    this.agncyService.updateAgency(this.agency.id, payload).subscribe({
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
