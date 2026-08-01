export interface YearEntry {
  academicYear: string;
  totalNumber: number;
}

export interface StudentData {
  category: {
    gender: {
      male: YearEntry[];
      female: YearEntry[];
    };
    academicDegree: {
      bachelor: YearEntry[];
      postgraduate: YearEntry[];
    };
    branchCollege: {
      riyadh: CampusColleges;
      jeddah: CampusColleges;
      alAhasa: CampusColleges;
    };
  };
}

export interface CampusColleges {
  com?: YearEntry[];
  cod?: YearEntry[];
  cop?: YearEntry[];
  con?: YearEntry[];
  cphhi?: YearEntry[];
  cams?: YearEntry[];
  coshp?: YearEntry[];
  pme?: YearEntry[];
}

export type CampusKey = 'riyadh' | 'jeddah' | 'alAhasa';
export type CollegeKey = keyof CampusColleges;

export const COLLEGE_LABELS: Record<CollegeKey, string> = {
  com: 'College of Medicine',
  cod: 'College of Dentistry',
  cop: 'College of Pharmacy',
  con: 'College of Nursing',
  cphhi: 'Public Health & Health Informatics',
  cams: 'Applied Medical Sciences',
  coshp: 'College of Science & Health Professions',
  pme: 'Postgraduate Medical Education',
};

export const CAMPUS_LABELS: Record<CampusKey, string> = {
  riyadh: 'Riyadh',
  jeddah: 'Jeddah',
  alAhasa: 'Al-Ahsa',
};

export interface KpiData {
  totalStudents: number;
  growthRate: number;
  female: number;
  femalePercent: number;
  postgraduate: number;
  postgraduatePercent: number;
  largestCampus: string;
  largestCampusPercent: number;
}
