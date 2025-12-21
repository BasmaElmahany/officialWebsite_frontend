import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DirectorateService } from '../../Services/directorate.service';
import { CreateDirectorate, Directorate } from '../../Models/directorate';
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
      private directorateService: DirectorateService,
      private dialogRef: MatDialogRef<EditComponent>,
      @Inject(MAT_DIALOG_DATA) public directorate: Directorate,
      public i18n: I18nService
    ) {
      this.form.patchValue({
        nameAr: directorate.nameAr ?? '',
        nameEn: directorate.nameEn ?? ''
      });
    }
  
    submit(): void {
      if (this.form.invalid || this.loading) return;
  
      this.loading = true;
  
      const payload: CreateDirectorate = {
        nameAr: this.form.get('nameAr')!.value!,
        nameEn: this.form.get('nameEn')!.value!
      };
  
      this.directorateService.updateDirectorate(this.directorate.id, payload).subscribe({
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
