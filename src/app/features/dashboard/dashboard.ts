import { Component, computed, inject } from '@angular/core';
import { StudentDataService } from '../../core/services/student-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentTrends } from './components/student-trends/student-trends';
import { KpiCards } from "./components/kpi-cards/kpi-cards";
import { GenderRatio } from "./components/gender-ratio/gender-ratio";
import { DrillDown } from "./components/drill-down/drill-down";
import { InsightsComponent } from './components/insights/insights';
import { CampusEnrollment } from './components/campus-enrollment/campus-enrollment';
import { AdvancedAnalytics } from './components/advanced-analytics/advanced-analytics';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule, FormsModule,
    KpiCards, StudentTrends, AdvancedAnalytics,
    InsightsComponent, DrillDown, CampusEnrollment, GenderRatio,
    KpiCards,
    GenderRatio,
    DrillDown
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
private svc = inject(StudentDataService);
  readonly years = computed(() => this.svc.getYears());
  selected = this.svc.selectedYear();

  onYearChange(year: string): void {
    this.svc.selectedYear.set(year);
  }
}
