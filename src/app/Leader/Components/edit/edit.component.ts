import { Component, Inject } from '@angular/core';
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
    photoUrl: [''],
    isEnded: [false]
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public leader: Leader,
    private leaderService: LeaderService
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
      photoUrl: leader.photoUrl ?? '',
      isEnded: leader.isEnded ?? false
    });
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
