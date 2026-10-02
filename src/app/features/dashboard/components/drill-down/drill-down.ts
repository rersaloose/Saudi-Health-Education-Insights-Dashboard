import {
  Component,
  computed,
  inject,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
  effect,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampusKey } from '../../../../core/models/student-data.model';
import { Chart, registerables } from 'chart.js';
import { NumberFormatPipe } from '../../../../shared/pipes/number-formate.pipe';
import { StudentDataService } from '../../../../core/services/student-service';
import { CardState } from '../../../../shared/components/card-state/card-state';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

Chart.register(...registerables);
const COLLEGE_KEY_MAP: Record<string, string> = {
  com: 'COM',
  cod: 'COD',
  cop: 'COP',
  con: 'CON',
  cphhi: 'CPHHI',
  cams: 'CAMS',
  coshp: 'COSHP',
  pme: 'PME',

  medicine: 'COM',
  dentistry: 'COD',
  pharmacy: 'COP',
  nursing: 'CON',
  'public health': 'CPHHI',
  'applied sciences': 'CAMS',
  'science & health': 'COSHP',
  'postgrad medical': 'PME',
  'college of medicine': 'COM',
  'college of dentistry': 'COD',
  'college of pharmacy': 'COP',
  'college of nursing': 'CON',
  'public health & health informatics': 'CPHHI',
  'applied medical sciences': 'CAMS',
  'college of science & health professions': 'COSHP',
  'postgraduate medical education': 'PME',
};

@Component({
  selector: 'app-drill-down',
  imports: [CommonModule, FormsModule, NumberFormatPipe, CardState, TranslatePipe],
  templateUrl: './drill-down.html',
  styleUrl: './drill-down.css',
})
export class DrillDown implements AfterViewInit {
  @ViewChild('drillCanvas') drillCanvas!: ElementRef<HTMLCanvasElement>;

  readonly studentComponentServices = inject(StudentDataService);
  private translate = inject(TranslateService);
  private injector = inject(Injector);
  private chart: Chart | null = null;

  readonly loading = this.studentComponentServices.loading;
  readonly hasError = () => this.studentComponentServices.error() !== null;
  readonly hasData = this.studentComponentServices.hasData;
  readonly selectedCampus = signal<CampusKey>('riyadh');

  readonly campusOptions = [
    { key: 'riyadh' as CampusKey, label: 'CAMPUSES.RIYADH' },
    { key: 'jeddah' as CampusKey, label: 'CAMPUSES.JEDDAH' },
    { key: 'alAhasa' as CampusKey, label: 'CAMPUSES.ALAHASA' },
  ];

  readonly drillData = computed(() => {
    const currentLang = this.translate.currentLang;
    const year = this.studentComponentServices.selectedYear();
    const campus = this.selectedCampus();
    const raw = this.studentComponentServices.getDrillDownData(campus, year);
    const total = raw.reduce((s, r) => s + r.value, 0);

    return raw.map((r) => {
      const rawKey = (r.key || r.college || '').toLowerCase().trim();
      const normalizedKey = COLLEGE_KEY_MAP[rawKey] || rawKey.toUpperCase();

      const translationKey = `COLLEGES.${normalizedKey}`;
      const translated = this.translate.instant(translationKey);

      return {
        ...r,
        collegeName: translated !== translationKey ? translated : r.college,
        pct: total > 0 ? +((r.value / total) * 100).toFixed(1) : 0,
      };
    });
  });

  ngAfterViewInit(): void {
    effect(
      () => {
        const data = this.drillData();
        if (data.length && this.drillCanvas) {
          this.renderChart(data);
        }
      },
      { injector: this.injector },
    );
  }
  onResize(): void {
    this.chart?.resize();
  }
  private renderChart(
    data: { college: string; collegeName: string; value: number; key: string }[],
  ): void {
    this.chart?.destroy();
    const colors = [
      '#006B6B',
      '#2B7A9E',
      '#5BA4CF',
      '#3A9078',
      '#7AC4A8',
      '#E8916A',
      '#F5C26B',
      '#B57F9E',
    ];
    this.chart = new Chart(this.drillCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map((d) => d.collegeName),
        datasets: [
          {
            data: data.map((d) => d.value),
            backgroundColor: data.map((_, i) => colors[i % colors.length]),
            borderRadius: 4,
            maxBarThickness: 28,
          },
        ],
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
