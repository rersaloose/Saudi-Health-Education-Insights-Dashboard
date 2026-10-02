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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../../../core/services/TranslationService';
import { AutoResizeDirective } from '../../../../core/services/resize';

Chart.register(...registerables);

@Component({
  selector: 'app-gender-ratio',
  imports: [CommonModule, CardState, AutoResizeDirective, TranslatePipe],
  templateUrl: './gender-ratio.html',
  styleUrl: './gender-ratio.css',
})
export class GenderRatio implements AfterViewInit {
  @ViewChild('donutCanvas') donutCanvas!: ElementRef<HTMLCanvasElement>;

  readonly svc = inject(StudentDataService);
  private transSvc = inject(TranslationService);
  private translate = inject(TranslateService);
  private injector = inject(Injector);
  private chart: Chart | null = null;

  readonly loading = this.svc.loading;
  readonly hasError = () => this.svc.error() !== null;

  readonly distribution = computed(() => {
    const lang = this.transSvc.currentLang();
    const rawData = this.svc.getEnrollmentByCollege(this.svc.selectedYear());

    return rawData.map((item) => {
      const key = (item.key || item.college || '').toUpperCase();
      const translationKey = `COLLEGES.${key}`;
      const translated = this.translate.instant(translationKey);

      return {
        ...item,
        translatedCollege: translated !== translationKey ? translated : item.college,
      };
    });
  });

  readonly hasData = () => this.distribution().length > 0;

  ngAfterViewInit(): void {
    effect(
      () => {
        this.transSvc.currentLang();
        const data = this.distribution();

        if (data.length && this.donutCanvas) {
          this.renderChart(data);
        }
      },
      { injector: this.injector },
    );
  }

  private renderChart(
    data: {
      college: string;
      translatedCollege: string;
      value: number;
      pct: number;
      color: string;
    }[],
  ): void {
    this.chart?.destroy();
    this.chart = new Chart(this.donutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.map((d) => d.translatedCollege),
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
  onResize(): void {
    this.chart?.resize();
  }
}
