import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Feature {
  icon: 'kpi' | 'trends' | 'campus' | 'drill' | 'heat' | 'distribution' | 'insights' | 'filters';
  title: string;
  desc: string;
}
@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  readonly features: Feature[] = [
    {
      icon: 'kpi',
      title: 'KPI Cards',
      desc: 'Key performance indicators showing total students, growth rate, female percentage, postgraduate count, and largest campus — all updating in real time with the selected academic year.',
    },
    {
      icon: 'trends',
      title: 'Student Trends',
      desc: 'Line charts visualizing total enrollment and gender breakdown over 8 academic years, with gradient fills and interactive tooltips.',
    },
    {
      icon: 'campus',
      title: 'Campus Enrollment',
      desc: 'Horizontal bar comparison of all three campuses plus a trend chart for the selected campus, with a campus selector filter.',
    },
    {
      icon: 'drill',
      title: 'Drill-Down Analysis',
      desc: 'Horizontal bar chart and detailed table showing per-college enrollment for a selected campus, with percentage share calculations.',
    },
    {
      icon: 'heat',
      title: 'Advanced Analytics',
      desc: 'Top colleges ranking with mini bar charts and a color-coded enrollment heatmap across colleges and academic years, filterable by campus.',
    },
    {
      icon: 'distribution',
      title: 'Enrollment Distribution',
      desc: 'Donut chart showing the proportional share of each college in total university enrollment, with a color-coded legend.',
    },
    {
      icon: 'insights',
      title: 'Insights & Highlights',
      desc: 'Automatically generated textual insights highlighting growth trends, gender ratio changes, and postgraduate enrollment milestones.',
    },
    {
      icon: 'filters',
      title: 'Interactive Filters',
      desc: 'Academic year selector in the header and campus selectors in individual cards — all reactive with Angular signals for instant updates.',
    },
  ];
}
