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
import { HeaderService } from '../../core/services/header.services';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,

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
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private svc = inject(StudentDataService);
  readonly themeSvc = inject(ThemeService);
  readonly transSvc = inject(TranslationService);
  readonly headerService = inject(HeaderService);
  ngOnInit(): void {
    this.headerService.setYearFilterVisibility(true);
  }

  ngOnDestroy(): void {
    this.headerService.setYearFilterVisibility(false);
  }
}
