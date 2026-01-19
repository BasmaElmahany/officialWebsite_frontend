import { Component, Inject } from '@angular/core';
import { AdministrativeDevicesService } from '../../Services/administrative-devices.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdministrativeDevice } from '../../Models/AdministrativeDevice';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-administrative-devices-delete',
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent {
  loading = false;

  constructor(
    private adminDevicesService: AdministrativeDevicesService,
    private dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public device: AdministrativeDevice,
    public i18n: I18nService
  ) {}

  confirm(): void {
    this.loading = true;
    this.adminDevicesService.delete(this.device.id).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: () => this.loading = false
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
