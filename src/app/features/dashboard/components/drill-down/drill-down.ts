import {
  Component, computed, inject, signal, ViewChild, ElementRef, AfterViewInit, effect, Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampusKey } from '../../../../core/models/student-data.model';
import { Chart, registerables } from 'chart.js';
import { NumberFormatPipe } from '../../../../shared/pipes/number-formate.pipe';
import { StudentDataService } from '../../../../core/services/student-service';

Chart.register(...registerables);

@Component({
  selector: 'app-drill-down',
   imports: [CommonModule, FormsModule, NumberFormatPipe],
  templateUrl: './drill-down.html',
  styleUrl: './drill-down.css',
})
export class DrillDown {
 @ViewChild('drillCanvas') drillCanvas!: ElementRef<HTMLCanvasElement>;

  readonly svc = inject(StudentDataService);
  private injector = inject(Injector);
  private chart: Chart | null = null;

  readonly selectedCampus = signal<CampusKey>('riyadh');

  readonly campusOptions = [
    { key: 'riyadh' as CampusKey, label: 'Riyadh' },
    { key: 'jeddah' as CampusKey, label: 'Jeddah' },
    { key: 'alAhasa' as CampusKey, label: 'Al-Ahsa' },
  ];

  readonly drillData = computed(() => {
    const year = this.svc.selectedYear();
    const campus = this.selectedCampus();
    const raw = this.svc.getDrillDownData(campus, year);
    const total = raw.reduce((s, r) => s + r.value, 0);
    return raw.map(r => ({
      ...r,
      pct: total > 0 ? +((r.value / total) * 100).toFixed(1) : 0,
    }));
  });

  ngAfterViewInit(): void {
    effect(() => {
      const data = this.drillData();
      if (data.length && this.drillCanvas) {
        this.renderChart(data);
      }
    }, { injector: this.injector });
  }

  private renderChart(data: { college: string; value: number; key: string }[]): void {
    this.chart?.destroy();
    const colors = ['#006B6B', '#2B7A9E', '#5BA4CF', '#3A9078', '#7AC4A8', '#E8916A', '#F5C26B', '#B57F9E'];
    this.chart = new Chart(this.drillCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(d => d.college),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map((_, i) => colors[i % colors.length]),
          borderRadius: 4,
          maxBarThickness: 28,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: { grid: { color: '#f0f0f0' }, ticks: { font: { size: 9 } } },
          y: { grid: { display: false }, ticks: { font: { size: 10 } } },
        },
      },
    });
  }
}
