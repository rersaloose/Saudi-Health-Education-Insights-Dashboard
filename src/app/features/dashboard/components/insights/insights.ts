import { Component, computed, inject } from '@angular/core';
import { StudentDataService } from '../../../../core/services/student-service';
import { CommonModule } from '@angular/common';

interface Insight {
  icon: string;
  text: string;
  tag?: string;
  tagClass?: string;
}
@Component({
  selector: 'app-insights',
  imports: [CommonModule],
  templateUrl: './insights.html',
  styleUrl: './insights.css',
})
export class InsightsComponent {
private svc = inject(StudentDataService);

  readonly insights = computed<Insight[]>(() => {
    const kpis = this.svc.getKpis();
    const year = this.svc.selectedYear();
    const campusSeries = this.svc.getAllCampusEnrollmentOverTime();
    const years = this.svc.getYears();
    const lastIdx = years.length - 1;
    const threeAgoIdx = Math.max(0, lastIdx - 2);

    const jeddah3yr = campusSeries.jeddah[lastIdx] && campusSeries.jeddah[threeAgoIdx]
      ? (((campusSeries.jeddah[lastIdx] - campusSeries.jeddah[threeAgoIdx]) / campusSeries.jeddah[threeAgoIdx]) * 100).toFixed(1)
      : '0';

    const femaleFirst = this.svc.data()?.category.gender.female[0]?.totalNumber ?? 1;
    const femaleFirstTotal = this.svc.getTotalForYear(years[0] ?? year);
    const femaleFirstPct = femaleFirstTotal > 0 ? ((femaleFirst / femaleFirstTotal) * 100).toFixed(0) : '0';

    return [
      {
        icon: 'icon-campus',
        text: `<strong>Jeddah Campus</strong> shows the <strong>highest growth</strong> over the last 3 years at <strong>${jeddah3yr}%</strong>.`,
        tag: 'AR',
        tagClass: 'tag-blue',
      },
      {
        icon: 'icon-female-insight',
        text: `<strong>Female Students</strong> now make up <strong>${kpis.femalePercent}%</strong> of the total, up from <strong>${femaleFirstPct}%</strong> in ${years[0]?.split('/')[0] ?? '2016'}.`,
      },
      {
        icon: 'icon-graduation-insight',
        text: `<strong>Postgraduate Enrollment</strong> has increased to reach <strong>${kpis.postgraduate.toLocaleString()}</strong> students this year.`,
      },
    ];
  });
}
