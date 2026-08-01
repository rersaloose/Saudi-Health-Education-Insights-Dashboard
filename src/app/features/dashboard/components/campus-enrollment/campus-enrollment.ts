import {
  Component, computed, inject, signal, ViewChild, ElementRef, AfterViewInit, effect, Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampusKey } from '../../../../core/models/student-data.model';
import { Chart, registerables } from 'chart.js';
import { StudentDataService } from '../../../../core/services/student-service';
import { NumberFormatPipe } from '../../../../shared/pipes/number-formate.pipe';

Chart.register(...registerables);

@Component({
  selector: 'app-campus-enrollment',
  imports: [CommonModule, FormsModule, NumberFormatPipe],
  templateUrl: './campus-enrollment.html',
  styleUrl: './campus-enrollment.css',
})
export class CampusEnrollment {
@ViewChild('campusCanvas') campusCanvas!: ElementRef<HTMLCanvasElement>;

  readonly svc = inject(StudentDataService);
  private injector = inject(Injector);
  private chart: Chart | null = null;

  readonly selectedCampus = signal<CampusKey>('riyadh');

  readonly campusOptions = [
    { key: 'riyadh' as CampusKey, label: 'Riyadh' },
    { key: 'jeddah' as CampusKey, label: 'Jeddah' },
    { key: 'alAhasa' as CampusKey, label: 'Al-Ahsa' },
  ];

  readonly campusList = computed(() => {
    const totals = this.svc.getCampusTotals(this.svc.selectedYear());
    const max = Math.max(...Object.values(totals));
    return this.campusOptions.map(c => ({
      key: c.key,
      label: c.label,
      total: totals[c.key] ?? 0,
      pct: max > 0 ? ((totals[c.key] ?? 0) / max) * 100 : 0,
    }));
  });

  readonly campusTrend = computed(() => {
    const campus = this.selectedCampus();
    return this.svc.getCampusEnrollmentOverTime(campus);
  });

  ngAfterViewInit(): void {
    effect(() => {
      const series = this.campusTrend();
      if (series.labels.length && this.campusCanvas) {
        this.renderChart(series);
      }
    }, { injector: this.injector });
  }

  private renderChart(series: { labels: string[]; total: number[] }): void {
    this.chart?.destroy();
    const ctx = this.campusCanvas.nativeElement.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(0, 107, 107, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 107, 107, 0.02)');
    this.chart = new Chart(this.campusCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: series.labels,
        datasets: [{
          label: this.selectedCampus().charAt(0).toUpperCase() + this.selectedCampus().slice(1),
          data: series.total,
          borderColor: '#006B6B',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#006B6B',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: { grid: { color: '#f0f0f0' }, ticks: { font: { size: 10 } } },
        },
      },
    });
  }
}
