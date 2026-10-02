import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampusKey } from '../../../../core/models/student-data.model';
import { StudentDataService } from '../../../../core/services/student-service';
import { NumberFormatPipe } from '../../../../shared/pipes/number-formate.pipe';
import { CardState } from '../../../../shared/components/card-state/card-state';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../../../core/services/TranslationService';

const COLLEGE_KEY_MAP: Record<string, string> = {
  com: 'COM',
  cod: 'COD',
  cop: 'COP',
  con: 'CON',
  cphhi: 'CPHHI',
  cams: 'CAMS',
  coshp: 'COSHP',
  pme: 'PME',
  'science & health': 'COSHP',
  'postgrad medical': 'PME',
  medicine: 'COM',
  'applied sciences': 'CAMS',
  nursing: 'CON',
  dentistry: 'COD',
  pharmacy: 'COP',
  'public health': 'CPHHI',
};

@Component({
  selector: 'app-advanced-analytics',
  imports: [CommonModule, FormsModule, TranslatePipe, NumberFormatPipe, CardState],
  templateUrl: './advanced-analytics.html',
  styleUrl: './advanced-analytics.css',
})
export class AdvancedAnalytics {
  readonly svc = inject(StudentDataService);
  private transSvc = inject(TranslationService);
  private translate = inject(TranslateService);

  readonly loading = this.svc.loading;
  readonly hasError = () => this.svc.error() !== null;
  readonly hasData = this.svc.hasData;
  readonly selectedCampus = signal<CampusKey | 'all'>('all');

  readonly campusOptions = [
    { key: 'all' as const, label: 'CAMPUSES.ALL' },
    { key: 'riyadh' as CampusKey, label: 'CAMPUSES.RIYADH' },
    { key: 'jeddah' as CampusKey, label: 'CAMPUSES.JEDDAH' },
    { key: 'alAhasa' as CampusKey, label: 'CAMPUSES.AHA' },
  ];

  readonly heatYears = computed(() => this.svc.getYears());

  private getTranslatedCollegeName(rawName: string, key?: string): string {
    const lookupKey = (key || rawName || '').toLowerCase().trim();
    const mappedKey = COLLEGE_KEY_MAP[lookupKey] || lookupKey.toUpperCase();
    const translationKey = `COLLEGES.${mappedKey}`;
    const translated = this.translate.instant(translationKey);
    return translated !== translationKey ? translated : rawName;
  }

  readonly topColleges = computed(() => {
    this.transSvc.currentLang();

    const list = this.svc.getTopCollegesForCampus(
      this.selectedCampus(),
      this.svc.selectedYear(),
      5,
    );
    const max = list.length > 0 ? Math.max(...list.map((l) => l.value)) : 1;

    return list.map((l) => ({
      ...l,
      collegeName: this.getTranslatedCollegeName(l.college, l.key),
      pct: max > 0 ? (l.value / max) * 100 : 0,
    }));
  });

  readonly heatmapRows = computed(() => {
    this.transSvc.currentLang();

    const raw = this.svc.getCollegeHeatmapMatrix(this.selectedCampus());

    return raw.map((row) => ({
      ...row,
      collegeName: this.getTranslatedCollegeName(row.college, row.collegeKey),
    }));
  });

  heatColor(val: number): string {
    if (val >= 2000) return '#006B6B';
    if (val >= 1000) return '#2D7A4F';
    if (val >= 500) return '#5BA4CF';
    if (val >= 200) return '#7AC4A8';
    if (val > 0) return '#C5E8D8';
    return '#F4F7F7';
  }

  heatTextColor(val: number): string {
    return val >= 500 ? '#fff' : '#4A5C5C';
  }
}
