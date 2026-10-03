import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { TranslationService } from '../../core/services/TranslationService';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

interface Feature {
  icon: 'kpi' | 'trends' | 'campus' | 'drill' | 'heat' | 'distribution' | 'insights' | 'filters';
  title: string;
  desc: string;
}
@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  readonly themeServices = inject(ThemeService);
  readonly transServices = inject(TranslationService);
  private readonly translate = inject(TranslateService);

  readonly featureKeys: Feature[] = [
    {
      icon: 'kpi',
      title: 'ABOUT_PAGE.CAPABILITIES.KPI_TITLE',
      desc: 'ABOUT_PAGE.CAPABILITIES.KPI_DESC',
    },
    {
      icon: 'trends',
      title: 'ABOUT_PAGE.CAPABILITIES.TRENDS_TITLE',
      desc: 'ABOUT_PAGE.CAPABILITIES.TRENDS_DESC',
    },
    {
      icon: 'campus',
      title: 'ABOUT_PAGE.CAPABILITIES.CAMPUS_TITLE',
      desc: 'ABOUT_PAGE.CAPABILITIES.CAMPUS_DESC',
    },
    {
      icon: 'drill',
      title: 'ABOUT_PAGE.CAPABILITIES.DRILL_TITLE',
      desc: 'ABOUT_PAGE.CAPABILITIES.DRILL_DESC',
    },
    {
      icon: 'heat',
      title: 'ABOUT_PAGE.CAPABILITIES.HEAT_TITLE',
      desc: 'ABOUT_PAGE.CAPABILITIES.HEAT_DESC',
    },
    {
      icon: 'distribution',
      title: 'ABOUT_PAGE.CAPABILITIES.DIST_TITLE',
      desc: 'ABOUT_PAGE.CAPABILITIES.DIST_DESC',
    },
    {
      icon: 'insights',
      title: 'ABOUT_PAGE.CAPABILITIES.INSIGHTS_TITLE',
      desc: 'ABOUT_PAGE.CAPABILITIES.INSIGHTS_DESC',
    },
    {
      icon: 'filters',
      title: 'ABOUT_PAGE.CAPABILITIES.FILTERS_TITLE',
      desc: 'ABOUT_PAGE.CAPABILITIES.FILTERS_DESC',
    },
  ];

  readonly features = computed(() => {
    this.transServices.currentLang();

    return this.featureKeys.map((item) => ({
      icon: item.icon,
      title: this.translate.instant(item.title),
      desc: this.translate.instant(item.desc),
    }));
  });
}
