import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaderService } from '../../Services/leader.service';
import { LeaderCreateRequest } from '../../Services/leader-create-request.model';

@Component({
  selector: 'app-leader-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {
  leaderForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private leaderService: LeaderService,
    private dialogRef: MatDialogRef<CreateComponent>
  ) {
    this.leaderForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      cvDataAr: ['', Validators.required],
      cvDataEn: ['', Validators.required],
      positionAr: ['', Validators.required],
      positionEn: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      photoUrl: [null],
      isEnded: [false, Validators.required]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.leaderForm.patchValue({ photoUrl: file });
    }
  }

  submit() {
    if (this.leaderForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.success = '';
    const formValue: LeaderCreateRequest = this.leaderForm.value;
    this.leaderService.createLeader(formValue).subscribe({
      next: (res) => {
        this.success = 'Leader created successfully!';
        this.leaderForm.reset();
        this.loading = false;
        this.dialogRef.close(true); // Close dialog and trigger list refresh
      },
      error: (err) => {
        this.error = 'Failed to create leader.';
        this.loading = false;
      }
    });
  }
}
