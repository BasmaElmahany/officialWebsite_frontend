import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeaderService } from '../../Services/leader.service';
import { Leader } from '../../Models/leader';

@Component({
  selector: 'app-leader-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  leader?: Leader;
  msg?: string;
  loading = true;
  error = '';


  constructor(
    private leaderService: LeaderService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  ngOnInit(): void {
    const id = this.data?.id;
    if (!id) {
      this.loading = false;
      this.error = 'No leader ID provided.';
      return;
    }
    this.leaderService.getLeaderById(id).subscribe({
      next: (res: any) => {
        // If API returns {msg, data}, use data, else fallback
        if (res && res.data) {
          this.leader = res.data;
          this.msg = res.msg;
        } else {
          this.leader = res;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load leader details.';
        this.loading = false;
      }
    });
  }

  getPhotoUrl(photoUrl?: string): string {
    if (!photoUrl) return '';
    if (photoUrl.startsWith('http')) return photoUrl;
    // prepend server URL if relative
    return 'https://shusha.minya.gov.eg:93' + photoUrl;
  }

  close(): void {
    this.dialogRef.close();
  }
}
