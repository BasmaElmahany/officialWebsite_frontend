import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { I18nService } from '../../Services/i18n.service';
@Injectable({ providedIn: 'root' })
export class ToastService {

  constructor(
    private snack: MatSnackBar,
    private translate: I18nService
  ) {}

  success(key: string) {
    this.open(key, 'success-toast');
  }

  error(key: string) {
    this.open(key, 'error-toast');
  }

  private open(key: string, panelClass: string) {
    this.snack.open(
      this.translate.instant(key),
      this.translate.instant('COMMON.CLOSE') || '×',
      {
        duration: 3500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass
      }
    );
  }
}