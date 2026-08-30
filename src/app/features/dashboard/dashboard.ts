import { Component, computed, inject } from '@angular/core';
import { StudentDataService } from '../../core/services/student-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentTrends } from './components/student-trends/student-trends';
import { KpiCards } from './components/kpi-cards/kpi-cards';
import { GenderRatio } from './components/gender-ratio/gender-ratio';
import { DrillDown } from './components/drill-down/drill-down';
import { InsightsComponent } from './components/insights/insights';
import { CampusEnrollment } from './components/campus-enrollment/campus-enrollment';
import { AdvancedAnalytics } from './components/advanced-analytics/advanced-analytics';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageCode, TranslationService } from '../../core/services/TranslationService';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    KpiCards,
    StudentTrends,
    AdvancedAnalytics,
    InsightsComponent,
    DrillDown,
    CampusEnrollment,
    GenderRatio,
    KpiCards,
    TranslatePipe,
    GenderRatio,
    DrillDown,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private svc = inject(StudentDataService);
  readonly themeSvc = inject(ThemeService);
  readonly transSvc = inject(TranslationService);
  onLangChange(event: Event) {
    const lang = (event.target as HTMLSelectElement).value as LanguageCode;
    this.transSvc.changeLang(lang);
  }
  readonly years = computed(() => this.svc.getYears());
  selected = this.svc.selectedYear();

  onYearChange(year: string): void {
    this.svc.selectedYear.set(year);
  }
}
