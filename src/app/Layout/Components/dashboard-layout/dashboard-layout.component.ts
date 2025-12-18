import { Component } from '@angular/core';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-dashboard-layout',

  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {
   isCollapsed = false;

  constructor(public i18n: I18nService) {}

  toggleLang(): void {
    this.i18n.toggleLanguage();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
