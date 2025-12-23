import { I18nService } from '../../../Shared/Services/i18n.service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeaderService } from '../../Services/leader.service';
import { Leader } from '../../Models/leader';

@Component({
  selector: 'app-leader-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['../../../Center/Components/create/create.component.scss']
})
export class DeleteComponent {
  loading = false;

  constructor(
    private leaderService: LeaderService,
    private dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public leader: Leader,
    public i18n: I18nService
  ) {}

  confirm(): void {
    this.loading = true;
    this.leaderService.deleteLeader(this.leader.id).subscribe({
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
