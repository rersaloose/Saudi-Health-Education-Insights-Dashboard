import {
  Component, computed, inject, signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampusKey } from '../../../../core/models/student-data.model';
import { StudentDataService } from '../../../../core/services/student-service';
import { NumberFormatPipe } from '../../../../shared/pipes/number-formate.pipe';

@Component({
  selector: 'app-advanced-analytics',
  imports: [CommonModule, FormsModule, NumberFormatPipe],
  templateUrl: './advanced-analytics.html',
  styleUrl: './advanced-analytics.css',
})
export class AdvancedAnalytics {
 readonly svc = inject(StudentDataService);

  readonly selectedCampus = signal<CampusKey | 'all'>('all');

  readonly campusOptions = [
    { key: 'all' as const, label: 'All Campuses' },
    { key: 'riyadh' as CampusKey, label: 'Riyadh' },
    { key: 'jeddah' as CampusKey, label: 'Jeddah' },
    { key: 'alAhasa' as CampusKey, label: 'Al-Ahsa' },
  ];

  readonly heatYears = computed(() => this.svc.getYears());

  readonly topColleges = computed(() => {
    const list = this.svc.getTopCollegesForCampus(this.selectedCampus(), this.svc.selectedYear(), 5);
    const max = list.length > 0 ? Math.max(...list.map(l => l.value)) : 1;
    return list.map(l => ({ ...l, pct: max > 0 ? (l.value / max) * 100 : 0 }));
  });

  readonly heatmapRows = computed(() => this.svc.getCollegeHeatmapMatrix(this.selectedCampus()));

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
