import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { AdministrativeDevice } from '../../Models/AdministrativeDevice';
import { AdministrativeDevicesService } from '../../Services/administrative-devices.service';

@Component({
  selector: 'app-administrative-devices-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  loading = true;
  device?: AdministrativeDevice;

  constructor(
    private adminDevicesService: AdministrativeDevicesService,
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    const id = this.data?.id;
    if (!id) {
      this.loading = false;
      return;
    }
    this.adminDevicesService.getById(id).subscribe({
      next: (res: AdministrativeDevice) => {
        this.device = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
