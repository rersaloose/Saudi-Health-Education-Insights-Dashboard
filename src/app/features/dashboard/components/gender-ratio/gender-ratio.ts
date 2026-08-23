import {
  Component,
  computed,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  effect,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { StudentDataService } from '../../../../core/services/student-service';
import { CardState } from '../../../../shared/components/card-state/card-state';

Chart.register(...registerables);

@Component({
  selector: 'app-gender-ratio',
  imports: [CommonModule, CardState],
  templateUrl: './gender-ratio.html',
  styleUrl: './gender-ratio.css',
})
export class GenderRatio {
  @ViewChild('donutCanvas') donutCanvas!: ElementRef<HTMLCanvasElement>;

  readonly svc = inject(StudentDataService);
  private injector = inject(Injector);
  private chart: Chart | null = null;

  readonly loading = this.svc.loading;
  readonly hasError = () => this.svc.error() !== null;

  readonly distribution = computed(() => this.svc.getEnrollmentByCollege(this.svc.selectedYear()));
  readonly hasData = () => this.distribution().length > 0;
  ngAfterViewInit(): void {
    effect(
      () => {
        const data = this.distribution();
        if (data.length && this.donutCanvas) {
          this.renderChart(data);
        }
      },
      { injector: this.injector },
    );
  }

  private renderChart(
    data: { college: string; value: number; pct: number; color: string }[],
  ): void {
    this.chart?.destroy();
    this.chart = new Chart(this.donutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.map((d) => d.college),
        datasets: [
          {
            data: data.map((d) => d.value),
            backgroundColor: data.map((d) => d.color),
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed.toLocaleString()}`,
            },
          },
        },
      },
    });
  }
}
