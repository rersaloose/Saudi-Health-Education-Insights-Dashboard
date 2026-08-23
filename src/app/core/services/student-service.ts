import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  StudentData,
  YearEntry,
  CampusKey,
  CollegeKey,
  KpiData,
  CAMPUS_LABELS,
} from '../models/student-data.model';
import { catchError, map, of } from 'rxjs';
export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class StudentDataService {
  private readonly dataUrl = 'assets/data/students-data.json';
  private readonly http = inject(HttpClient);

  private readonly state$ = this.http.get<StudentData>(this.dataUrl).pipe(
    map(
      (data): DataState<StudentData> => ({
        data,
        loading: false,
        error: null,
      }),
    ),
    catchError(() =>
      of<DataState<StudentData>>({
        data: null,
        loading: false,
        error: 'Unable to load student data',
      }),
    ),
  );

  private readonly state = toSignal(this.state$, {
    initialValue: {
      data: null,
      loading: true,
      error: null,
    } as DataState<StudentData>,
  });

  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly hasError = computed(() => this.state().error !== null);

  readonly hasData = computed(() => {
    const data = this.state().data;
    return data !== null;
  });

  readonly data = computed(() => this.state().data);

  readonly selectedYear = signal<string>('2023/2024');
  constructor() {}

  getYears(): string[] {
    const d = this.data();
    if (!d) return [];
    return d.category.gender.male.map((e) => e.academicYear);
  }

  getTotalForYear(year: string): number {
    const d = this.data();
    if (!d) return 0;
    const m = d.category.gender.male.find((e) => e.academicYear === year)?.totalNumber ?? 0;
    const f = d.category.gender.female.find((e) => e.academicYear === year)?.totalNumber ?? 0;
    return m + f;
  }

  getKpis(): KpiData {
    const d = this.data();
    const year = this.selectedYear();
    if (!d)
      return {
        totalStudents: 0,
        growthRate: 0,
        female: 0,
        femalePercent: 0,
        postgraduate: 0,
        postgraduatePercent: 0,
        largestCampus: '',
        largestCampusPercent: 0,
      };

    const male = d.category.gender.male.find((e) => e.academicYear === year)?.totalNumber ?? 0;
    const female = d.category.gender.female.find((e) => e.academicYear === year)?.totalNumber ?? 0;
    const total = male + female;

    const years = this.getYears();
    const idx = years.indexOf(year);
    const prevYear = idx > 0 ? years[idx - 1] : null;
    const prevTotal = prevYear ? this.getTotalForYear(prevYear) : total;
    const growthRate = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;

    const postgrad =
      d.category.academicDegree.postgraduate.find((e) => e.academicYear === year)?.totalNumber ?? 0;

    const campusTotals = this.getCampusTotals(year);
    const maxCampus = Object.entries(campusTotals).sort((a, b) => b[1] - a[1])[0];
    const largestCampus = maxCampus ? CAMPUS_LABELS[maxCampus[0] as CampusKey] : '';
    const largestCampusPercent = total > 0 && maxCampus ? (maxCampus[1] / total) * 100 : 0;

    return {
      totalStudents: total,
      growthRate: +growthRate.toFixed(1),
      female,
      femalePercent: total > 0 ? +((female / total) * 100).toFixed(1) : 0,
      postgraduate: postgrad,
      postgraduatePercent: total > 0 ? +((postgrad / total) * 100).toFixed(1) : 0,
      largestCampus,
      largestCampusPercent: +largestCampusPercent.toFixed(1),
    };
  }

  getCampusTotals(year: string): Record<CampusKey, number> {
    const d = this.data();
    if (!d) return { riyadh: 0, jeddah: 0, alAhasa: 0 };
    const result = {} as Record<CampusKey, number>;
    const bc = d.category.branchCollege;
    for (const campus of ['riyadh', 'jeddah', 'alAhasa'] as CampusKey[]) {
      let sum = 0;
      for (const col of Object.values(bc[campus])) {
        sum += (col as YearEntry[]).find((e) => e.academicYear === year)?.totalNumber ?? 0;
      }
      result[campus] = sum;
    }
    return result;
  }

  getTrendSeries(): { labels: string[]; male: number[]; female: number[]; total: number[] } {
    const d = this.data();
    if (!d) return { labels: [], male: [], female: [], total: [] };
    const labels = d.category.gender.male.map((e) => e.academicYear);
    const male = d.category.gender.male.map((e) => e.totalNumber);
    const female = d.category.gender.female.map((e) => e.totalNumber);
    const total = male.map((m, i) => m + female[i]);
    return { labels, male, female, total };
  }

  getCampusEnrollmentOverTime(campus: CampusKey): { labels: string[]; total: number[] } {
    const d = this.data();
    if (!d) return { labels: [], total: [] };
    const years = this.getYears();
    const colleges = d.category.branchCollege[campus];
    const total = years.map((yr) => {
      let sum = 0;
      for (const col of Object.values(colleges)) {
        sum += (col as YearEntry[]).find((e) => e.academicYear === yr)?.totalNumber ?? 0;
      }
      return sum;
    });
    return { labels: years, total };
  }

  getAllCampusEnrollmentOverTime(): {
    labels: string[];
    riyadh: number[];
    jeddah: number[];
    alAhasa: number[];
  } {
    const d = this.data();
    if (!d) return { labels: [], riyadh: [], jeddah: [], alAhasa: [] };
    const labels = this.getYears();
    return {
      labels,
      riyadh: this.getCampusEnrollmentOverTime('riyadh').total,
      jeddah: this.getCampusEnrollmentOverTime('jeddah').total,
      alAhasa: this.getCampusEnrollmentOverTime('alAhasa').total,
    };
  }

  /** Returns campus totals for two years (for grouped bar chart in drill-down) */
  getCampusComparisonData(
    yearA: string,
    yearB: string,
  ): {
    campuses: string[];
    valuesA: number[];
    valuesB: number[];
    growthPct: number[];
  } {
    const campuses: CampusKey[] = ['riyadh', 'jeddah', 'alAhasa'];
    const labels = campuses.map((c) => CAMPUS_LABELS[c]);
    const totalsA = this.getCampusTotals(yearA);
    const totalsB = this.getCampusTotals(yearB);
    const valuesA = campuses.map((c) => totalsA[c] ?? 0);
    const valuesB = campuses.map((c) => totalsB[c] ?? 0);
    const growthPct = campuses.map((c, i) =>
      valuesA[i] > 0 ? +(((valuesB[i] - valuesA[i]) / valuesA[i]) * 100).toFixed(1) : 0,
    );
    return { campuses: labels, valuesA, valuesB, growthPct };
  }

  /** Year-over-year growth for each campus across all years – for the growth heatmap */
  getCampusGrowthByYear(): {
    years: string[];
    riyadh: number[];
    jeddah: number[];
    alAhasa: number[];
  } {
    const years = this.getYears();
    const calc = (c: CampusKey) => {
      const totals = this.getCampusEnrollmentOverTime(c).total;
      return totals.map((v, i) =>
        i === 0 || totals[i - 1] === 0
          ? 0
          : +(((v - totals[i - 1]) / totals[i - 1]) * 100).toFixed(1),
      );
    };
    return { years, riyadh: calc('riyadh'), jeddah: calc('jeddah'), alAhasa: calc('alAhasa') };
  }

  getDrillDownData(
    campus: CampusKey,
    year: string,
  ): { college: string; value: number; key: string }[] {
    const d = this.data();
    if (!d) return [];
    const colleges = d.category.branchCollege[campus];
    return Object.entries(colleges)
      .map(([key, entries]) => ({
        key,
        college: this.getCollegeShortName(key as CollegeKey),
        value: (entries as YearEntry[]).find((e) => e.academicYear === year)?.totalNumber ?? 0,
      }))
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value);
  }

  /** Top N colleges by enrollment, optionally filtered by campus */
  getTopCollegesForCampus(
    campus: CampusKey | 'all',
    year: string,
    limit = 5,
  ): {
    college: string;
    key: string;
    value: number;
    color: string;
  }[] {
    const d = this.data();
    if (!d) return [];
    const colors = ['#006B6B', '#2B7A9E', '#5BA4CF', '#3A9078', '#E8916A'];
    const campuses: CampusKey[] = campus === 'all' ? ['riyadh', 'jeddah', 'alAhasa'] : [campus];
    const map = new Map<string, number>();
    for (const c of campuses) {
      for (const [key, entries] of Object.entries(d.category.branchCollege[c])) {
        const val = (entries as YearEntry[]).find((e) => e.academicYear === year)?.totalNumber ?? 0;
        map.set(key, (map.get(key) ?? 0) + val);
      }
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key, value], i) => ({
        college: this.getCollegeShortName(key as CollegeKey),
        key,
        value,
        color: colors[i] ?? '#999',
      }));
  }

  /** Heatmap matrix: colleges × years → enrollment value (filtered by campus) */
  getCollegeHeatmapMatrix(campus: CampusKey | 'all'): {
    collegeKey: string;
    college: string;
    values: number[];
  }[] {
    const d = this.data();
    if (!d) return [];
    const years = this.getYears();
    const campuses: CampusKey[] = campus === 'all' ? ['riyadh', 'jeddah', 'alAhasa'] : [campus];
    const map = new Map<string, number[]>();
    for (const c of campuses) {
      for (const [key, entries] of Object.entries(d.category.branchCollege[c])) {
        const existing = map.get(key) ?? years.map(() => 0);
        (entries as YearEntry[]).forEach((e, i) => {
          existing[i] += e.totalNumber;
        });
        map.set(key, existing);
      }
    }
    return [...map.entries()]
      .sort((a, b) => (b[1][years.length - 1] ?? 0) - (a[1][years.length - 1] ?? 0))
      .slice(0, 5)
      .map(([key, values]) => ({
        collegeKey: key,
        college: this.getCollegeShortName(key as CollegeKey),
        values,
      }));
  }

  /** Per-college enrollment share for donut chart */
  getEnrollmentByCollege(
    year: string,
  ): { college: string; key: string; value: number; pct: number; color: string }[] {
    const d = this.data();
    if (!d) return [];
    const colors = [
      '#006B6B',
      '#2B7A9E',
      '#5BA4CF',
      '#3A9078',
      '#E8916A',
      '#F5C26B',
      '#B57F9E',
      '#7AC4A8',
    ];
    const map = new Map<string, number>();
    for (const c of ['riyadh', 'jeddah', 'alAhasa'] as CampusKey[]) {
      for (const [key, entries] of Object.entries(d.category.branchCollege[c])) {
        const val = (entries as YearEntry[]).find((e) => e.academicYear === year)?.totalNumber ?? 0;
        map.set(key, (map.get(key) ?? 0) + val);
      }
    }
    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((s, [, v]) => s + v, 0);
    return sorted.map(([key, value], i) => ({
      college: this.getCollegeShortName(key as CollegeKey),
      key,
      value,
      pct: total > 0 ? +((value / total) * 100).toFixed(1) : 0,
      color: colors[i % colors.length],
    }));
  }

  getCollegeShortName(key: CollegeKey): string {
    const names: Record<string, string> = {
      com: 'Medicine',
      cod: 'Dentistry',
      cop: 'Pharmacy',
      con: 'Nursing',
      cphhi: 'Public Health',
      cams: 'Applied Sciences',
      coshp: 'Science & Health',
      pme: 'Postgrad Medical',
    };
    return names[key] ?? key.toUpperCase();
  }
}
