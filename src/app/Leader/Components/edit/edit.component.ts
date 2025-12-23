import { Component, Inject } from '@angular/core';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { LeaderService } from '../../Services/leader.service';
import { Leader } from '../../Models/leader';

@Component({
  selector: 'app-leader-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  photoPreview: string | null = null;
  loading = false;
  error: string | null = null;

  form = this.fb.group({
    nameAr: ['', Validators.required],
    nameEn: ['', Validators.required],
    cvDataAr: [''],
    cvDataEn: [''],
    positionAr: [''],
    positionEn: [''],
    startDate: [''],
    endDate: [''],
    photoUrl: [null as string | File | null],
    isEnded: [false]
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public leader: Leader,
    private leaderService: LeaderService,
    public i18n: I18nService
  ) {
    this.form.patchValue({
      nameAr: leader.nameAr ?? '',
      nameEn: leader.nameEn ?? '',
      cvDataAr: leader.cvDataAr ?? '',
      cvDataEn: leader.cvDataEn ?? '',
      positionAr: leader.positionAr ?? '',
      positionEn: leader.positionEn ?? '',
      startDate: leader.startDate ?? '',
      endDate: leader.endDate ?? '',
      photoUrl: null,
      isEnded: leader.isEnded ?? false
    });
    // معاينة الصورة الحالية
    if (leader.photoUrl) {
      this.photoPreview = leader.photoUrl.startsWith('http') ? leader.photoUrl : 'https://shusha.minya.gov.eg:93' + leader.photoUrl;
    }
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({ photoUrl: file });
      this.form.get('photoUrl')!.markAsDirty();
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    const payload: any = {
      nameAr: this.form.get('nameAr')!.value || '',
      nameEn: this.form.get('nameEn')!.value || '',
      cvDataAr: this.form.get('cvDataAr')!.value || '',
      cvDataEn: this.form.get('cvDataEn')!.value || '',
      positionAr: this.form.get('positionAr')!.value || '',
      positionEn: this.form.get('positionEn')!.value || '',
      startDate: this.form.get('startDate')!.value || '',
      endDate: this.form.get('endDate')!.value || '',
      isEnded: !!this.form.get('isEnded')!.value
    };
    // photoUrl يجب أن يكون من نوع File أو null
    const photoUrlValue = this.form.get('photoUrl')!.value;
    if (typeof photoUrlValue === 'object' && photoUrlValue !== null && 'name' in photoUrlValue) {
      payload.photoUrl = photoUrlValue;
    } else {
      payload.photoUrl = null;
    }
    this.leaderService.updateLeader(this.leader.id, payload).subscribe({
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