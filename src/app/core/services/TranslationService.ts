import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type LanguageCode = 'en' | 'ar' | 'de';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly translate = inject(TranslateService);

  readonly currentLang = signal<LanguageCode>('en');

  readonly availableLangs = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'de', label: 'Deutsch', dir: 'ltr' },
  ];

  constructor() {
    this.translate.addLangs(['en', 'ar', 'de']);

    const savedLang = (localStorage.getItem('app_lang') as LanguageCode) || 'en';
    this.changeLang(savedLang);
  }

  changeLang(lang: LanguageCode) {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem('app_lang', lang);

    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }
}
