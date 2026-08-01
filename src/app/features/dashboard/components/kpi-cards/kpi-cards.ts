import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NumberFormatPipe } from '../../../../shared/pipes/number-formate.pipe';
import { StudentDataService } from '../../../../core/services/student-service';

@Component({
  selector: 'app-kpi-cards',
  imports: [CommonModule, NumberFormatPipe],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.css',
})
export class KpiCards {
 private svc = inject(StudentDataService);

  readonly selectedYear = this.svc.selectedYear;
  readonly kpis = computed(() => this.svc.getKpis());
}
