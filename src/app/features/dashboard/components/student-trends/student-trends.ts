import {
  Component,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  effect,
  Injector,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { StudentDataService } from '../../../../core/services/student-service';
import { CardState } from '../../../../shared/components/card-state/card-state';
import { TranslationService } from '../../../../core/services/TranslationService';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-student-trends',
  imports: [CommonModule, CardState, TranslatePipe],
  templateUrl: './student-trends.html',
  styleUrl: './student-trends.css',
})
export class StudentTrends implements AfterViewInit {
  @ViewChild('totalCanvas') totalCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('genderCanvas') genderCanvas!: ElementRef<HTMLCanvasElement>;

  private svc = inject(StudentDataService);
  private transSvc = inject(TranslationService);
  private translate = inject(TranslateService);
  private injector = inject(Injector);

  private totalChart: Chart | null = null;
  private genderChart: Chart | null = null;

  readonly loading = this.svc.loading;
  readonly hasError = () => this.svc.error() !== null;
  readonly series = computed(() => this.svc.getTrendSeries());

  readonly hasData = () => this.series() !== null && (this.series()?.labels.length ?? 0) > 0;

  ngAfterViewInit(): void {
    effect(
      () => {
        // قراءة الـ Signal لضمان اعادة رسم المخططات فور تغير اللغة
        this.transSvc.currentLang();
        const series = this.svc.getTrendSeries();

        if (series.labels.length && this.totalCanvas && this.genderCanvas) {
          this.renderTotalChart(series);
          this.renderGenderChart(series);
        }
      },
      { injector: this.injector },
    );
  }

  private renderTotalChart(series: {
    labels: string[];
    male: number[];
    female: number[];
    total: number[];
  }): void {
    this.totalChart?.destroy();
    const ctx = this.totalCanvas.nativeElement.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(0, 107, 107, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 107, 107, 0.02)');

    this.totalChart = new Chart(this.totalCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: series.labels,
        datasets: [
          {
            label: this.translate.instant('TRENDS.TOTAL_STUDENTS'),
            data: series.total,
            borderColor: '#006B6B',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#006B6B',
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

  private renderGenderChart(series: {
    labels: string[];
    male: number[];
    female: number[];
    total: number[];
  }): void {
    this.genderChart?.destroy();
    this.genderChart = new Chart(this.genderCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: series.labels,
        datasets: [
          {
            label: this.translate.instant('TRENDS.MALE'),
            data: series.male,
            borderColor: '#2B7A9E',
            backgroundColor: 'transparent',
            tension: 0.4,
            pointRadius: 3,
          },
          {
            label: this.translate.instant('TRENDS.FEMALE'),
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
