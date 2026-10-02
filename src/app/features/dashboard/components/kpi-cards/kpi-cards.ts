import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NumberFormatPipe } from '../../../../shared/pipes/number-formate.pipe';
import { StudentDataService } from '../../../../core/services/student-service';
import { CardState } from '../../../../shared/components/card-state/card-state';
import { TranslationService } from '../../../../core/services/TranslationService';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-kpi-cards',
  imports: [CommonModule, CardState],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.css',
})
export class KpiCards {
  private studentDataService = inject(StudentDataService);
  readonly transServices = inject(TranslationService);
  private readonly translate = inject(TranslateService);
  readonly selectedYear = this.studentDataService.selectedYear;
  readonly globalLoading = this.studentDataService.loading;
  readonly globalError = this.studentDataService.error;
  readonly hasData = this.studentDataService.hasData;

  readonly kpis = computed(() => this.studentDataService.getKpis());

  private readonly icons = {
    graduation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    trend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    female: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><line x1="12" y1="14" x2="12" y2="22"/><line x1="9" y1="18" x2="15" y2="18"/></svg>`,
    location: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  };

  readonly cards = computed(() => {
    const lang = this.transServices.currentLang();

    const loading = this.globalLoading;
    const hasError = this.globalError;
    const KPI = this.kpis();

    const hasData = () => this.hasData() && KPI !== null;
    const errFn = () => hasError() !== null;

    const locale = lang === 'ar' ? 'ar-SA' : lang === 'de' ? 'de-DE' : 'en-US';
    const fmt = (v: number | null | undefined) => (v != null ? v.toLocaleString(locale) : '--');

    const awaiting = this.translate.instant('KPI.AWAITING_DATA');
    const shareText = this.translate.instant('KPI.SHARE');

    const campusName = KPI?.largestCampus
      ? this.translate.instant(`CAMPUSES.${KPI.largestCampus.toUpperCase()}`) || KPI.largestCampus
      : '--';

    return [
      {
        label: this.translate.instant('KPI.TOTAL_STUDENTS'),
        icon: 'assets/Images/graduation-cap.svg',
        cssClass: '',
        value: KPI ? fmt(KPI.totalStudents) : '--',
        valueClass: '',
        sub: KPI ? `${fmt(KPI.totalStudents)} | ${this.selectedYear()}` : awaiting,
        loading,
        hasData,
        hasError: errFn,
      },
      {
        label: this.translate.instant('KPI.GROWTH_RATE'),
        icon: 'assets/Images/growth-rate.svg',
        cssClass: 'kpi-growth',
        value: KPI ? `${KPI.growthRate > 0 ? '+' : ''}${KPI.growthRate}%` : '--',
        valueClass: KPI
          ? KPI.growthRate > 0
            ? 'positive'
            : KPI.growthRate < 0
              ? 'negative'
              : ''
          : '',
        sub: this.translate.instant('KPI.VS_LAST_YEAR'),
        loading,
        hasData,
        hasError: errFn,
      },
      {
        label: this.translate.instant('KPI.FEMALE'),
        icon: 'assets/Images/female-student.svg',
        cssClass: '',
        value: KPI ? fmt(KPI.female) : '--',
        badge: KPI ? `${KPI.femalePercent}%` : '',
        valueClass: '',
        sub: this.translate.instant('KPI.FEMALE_SUB'),
        loading,
        hasData,
        hasError: errFn,
      },
      {
        label: this.translate.instant('KPI.POSTGRADUATE'),
        icon: 'assets/Images/graduation-cap.svg',
        cssClass: '',
        value: KPI ? fmt(KPI.postgraduate) : '--',
        valueClass: '',
        sub: KPI ? `${fmt(KPI.postgraduate)} (${KPI.postgraduatePercent}%)` : awaiting,
        loading,
        hasData,
        hasError: errFn,
      },
      {
        label: this.translate.instant('KPI.LARGEST_CAMPUS'),
        icon: 'assets/Images/largest-campus.svg',
        cssClass: 'kpi-campus',
        value: campusName,
        valueClass: 'campus-name',
        sub: KPI?.largestCampus ? `${KPI.largestCampusPercent}% ${shareText}` : awaiting,
        loading,
        hasData,
        hasError: errFn,
      },
    ];
  });
}
