import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NumberFormatPipe } from '../../../../shared/pipes/number-formate.pipe';
import { StudentDataService } from '../../../../core/services/student-service';
import { CardState } from '../../../../shared/components/card-state/card-state';

@Component({
  selector: 'app-kpi-cards',
  imports: [CommonModule, NumberFormatPipe, CardState],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.css',
})
export class KpiCards {
  private svc = inject(StudentDataService);

  readonly selectedYear = this.svc.selectedYear;
  readonly globalLoading = this.svc.loading;
  readonly globalError = this.svc.error;
  readonly hasData = this.svc.hasData;

  readonly kpis = computed(() => this.svc.getKpis());

  private readonly icons = {
    graduation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    trend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    female: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><line x1="12" y1="14" x2="12" y2="22"/><line x1="9" y1="18" x2="15" y2="18"/></svg>`,
    location: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  };

  readonly cards = computed(() => {
    const loading = this.globalLoading;
    const hasError = this.globalError;
    const k = this.kpis();

    const hasData = () => this.hasData() && k !== null;
    const errFn = () => hasError() !== null;

    const fmt = (v: number | null | undefined) => (v != null ? v.toLocaleString('en-US') : '--');

    return [
      {
        label: 'Total Students',
        icon: 'assets/Images/graduation-cap.svg',
        cssClass: '',
        value: k ? fmt(k.totalStudents) : '--',
        valueClass: '',
        sub: k ? `${fmt(k.totalStudents)} | ${this.selectedYear()}` : 'Awaiting data',
        loading,
        hasData,
        hasError: errFn,
      },

      {
        label: 'Growth Rate',
        icon: 'assets/Images/growth-rate.svg',
        cssClass: 'kpi-growth',
        value: k ? `${k.growthRate > 0 ? '+' : ''}${k.growthRate}%` : '--',
        valueClass: k ? (k.growthRate > 0 ? 'positive' : k.growthRate < 0 ? 'negative' : '') : '',
        sub: 'vs last year',
        loading,
        hasData,
        hasError: errFn,
      },

      {
        label: 'Female',
        icon: 'assets/Images/female-student.svg',
        cssClass: '',
        value: k ? fmt(k.female) : '--',
        badge: k ? `${k.femalePercent}%` : '',
        valueClass: '',
        sub: 'Female Students',
        loading,
        hasData,
        hasError: errFn,
      },

      {
        label: 'Postgraduate',
        icon: 'assets/Images/graduation-cap.svg',
        cssClass: '',
        value: k ? fmt(k.postgraduate) : '--',
        valueClass: '',
        sub: k ? `${fmt(k.postgraduate)} (${k.postgraduatePercent}%)` : 'Awaiting data',
        loading,
        hasData,
        hasError: errFn,
      },

      {
        label: 'Largest Campus',
        icon: 'assets/Images/largest-campus.svg',
        cssClass: 'kpi-campus',
        value: k?.largestCampus || '--',
        valueClass: 'campus-name',
        sub: k?.largestCampus ? `${k.largestCampusPercent}% share` : 'Awaiting data',
        loading,
        hasData,
        hasError: errFn,
      },
    ];
  });
}
