import {
  Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, inject,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Directive({ selector: '[appChart]', standalone: true })
export class ChartDirective implements OnChanges, OnDestroy {
  @Input({ required: true }) appChart!: ChartConfiguration;

  private chart: Chart | null = null;
  private el = inject(ElementRef<HTMLCanvasElement>);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appChart']) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    const canvas = this.el.nativeElement as HTMLCanvasElement;
    this.chart = new Chart(canvas, this.appChart);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
