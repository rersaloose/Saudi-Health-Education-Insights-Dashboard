import { Component, computed, inject } from '@angular/core';
import { StudentDataService } from '../../../../core/services/student-service';
import { CommonModule } from '@angular/common';
import { CardState } from '../../../../shared/components/card-state/card-state';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../../../core/services/TranslationService';

interface Insight {
  icon: string;
  text: string;
  tag?: string;
  tagClass?: string;
}
@Component({
  selector: 'app-insights',
  imports: [CommonModule, CardState, TranslatePipe],
  templateUrl: './insights.html',
  styleUrl: './insights.css',
})
export class InsightsComponent {
  private studentDataService = inject(StudentDataService);
  private transServices = inject(TranslationService);
  private translate = inject(TranslateService);

  readonly loading = this.studentDataService.loading;
  readonly hasError = () => this.studentDataService.error() !== null;
  hasData = () => this.studentDataService.data() !== null;

  readonly insights = computed<Insight[]>(() => {
    const lang = this.transServices.currentLang();

    const kpis = this.studentDataService.getKpis();
    if (!kpis) return [];
    const year = this.studentDataService.selectedYear();
    const campusSeries = this.studentDataService.getAllCampusEnrollmentOverTime();
    if (!campusSeries) return [];
    const years = this.studentDataService.getYears();
    const lastIdx = years.length - 1;
    const threeAgoIdx = Math.max(0, lastIdx - 2);

    const jeddah3yr =
      campusSeries.jeddah[lastIdx] && campusSeries.jeddah[threeAgoIdx]
        ? (
            ((campusSeries.jeddah[lastIdx] - campusSeries.jeddah[threeAgoIdx]) /
              campusSeries.jeddah[threeAgoIdx]) *
            100
          ).toFixed(1)
        : '0';

    const femaleFirst = this.studentDataService.data()?.category.gender.female[0]?.totalNumber ?? 0;
    const femaleFirstTotal = this.studentDataService.getTotalForYear(years[0] ?? year);
    const femaleFirstPct =
      femaleFirstTotal > 0 && femaleFirst > 0
        ? ((femaleFirst / femaleFirstTotal) * 100).toFixed(0)
        : '0';

    const locale = lang === 'ar' ? 'ar-SA' : lang === 'de' ? 'de-DE' : 'en-US';
    const formattedPostgrad = kpis.postgraduate.toLocaleString(locale);
    const startYear = years[0]?.split('/')[0] ?? '2016';

    return [
      {
        icon: 'icon-campus',
        text: this.translate.instant('INSIGHTS.JEDDAH_GROWTH', { value: jeddah3yr }),
        tag: 'AR',
        tagClass: 'tag-blue',
      },
      {
        icon: 'icon-female-insight',
        text: this.translate.instant('INSIGHTS.FEMALE_RATIO', {
          current: kpis.femalePercent,
          first: femaleFirstPct,
          year: startYear,
        }),
      },
      {
        icon: 'icon-graduation-insight',
        text: this.translate.instant('INSIGHTS.POSTGRAD_INCREASE', { total: formattedPostgrad }),
      },
    ];
  });
}
