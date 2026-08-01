
import {
  Component, inject, ViewChild, ElementRef, AfterViewInit, effect, Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { StudentDataService } from '../../../../core/services/student-service';
@Component({
  selector: 'app-student-trends',
   imports: [CommonModule],
  templateUrl: './student-trends.html',
  styleUrl: './student-trends.css',
})
export class StudentTrends  implements AfterViewInit {
@ViewChild('totalCanvas') totalCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('genderCanvas') genderCanvas!: ElementRef<HTMLCanvasElement>;

  private svc = inject(StudentDataService);
  private injector = inject(Injector);
  private totalChart: Chart | null = null;
  private genderChart: Chart | null = null;

  ngAfterViewInit(): void {
    effect(() => {
      const series = this.svc.getTrendSeries();
      if (series.labels.length && this.totalCanvas && this.genderCanvas) {
        this.renderTotalChart(series);
        this.renderGenderChart(series);
      }
    }, { injector: this.injector });
  }

  private renderTotalChart(series: { labels: string[]; male: number[]; female: number[]; total: number[] }): void {
    this.totalChart?.destroy();
    const ctx = this.totalCanvas.nativeElement.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(0, 107, 107, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 107, 107, 0.02)');
    this.totalChart = new Chart(this.totalCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: series.labels,
        datasets: [{
          label: 'Total',
          data: series.total,
          borderColor: '#006B6B',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
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

  private renderGenderChart(series: { labels: string[]; male: number[]; female: number[]; total: number[] }): void {
    this.genderChart?.destroy();
    this.genderChart = new Chart(this.genderCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: series.labels,
        datasets: [
          {
            label: 'Male',
            data: series.male,
            borderColor: '#2B7A9E',
            backgroundColor: 'transparent',
            tension: 0.4,
            pointRadius: 3,
          },
          {
            label: 'Female',
            data: series.female,
            borderColor: '#E8916A',
            backgroundColor: 'transparent',
            tension: 0.4,
            pointRadius: 3,
          },
        ],
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
