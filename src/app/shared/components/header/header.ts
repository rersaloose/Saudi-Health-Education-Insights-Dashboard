import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderService } from '../../../core/services/header.services';
import { StudentDataService } from '../../../core/services/student-service';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService, LanguageCode } from '../../../core/services/TranslationService';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent {
  private studentComponentServices = inject(StudentDataService);
  readonly headerSvc = inject(HeaderService);
  readonly themeServices = inject(ThemeService);
  readonly transServices = inject(TranslationService);

  readonly years = computed(() => this.studentComponentServices.getYears());

  get selectedYear(): string {
    return this.studentComponentServices.selectedYear();
  }

  onLangChange(event: Event): void {
    const lang = (event.target as HTMLSelectElement).value as LanguageCode;
    this.transServices.changeLang(lang);
  }

  onYearChange(year: string): void {
    this.studentComponentServices.selectedYear.set(year);
  }
}
