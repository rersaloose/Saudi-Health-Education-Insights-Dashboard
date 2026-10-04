import { inject, Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

export type LanguageCode = 'en' | 'ar' | 'de';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly translate = inject(TranslateService);
  private titleService = inject(Title);
  readonly currentLang = signal<LanguageCode>('en');

  readonly availableLangs = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'de', label: 'Deutsch', dir: 'ltr' },
  ];

  constructor() {
    this.translate.addLangs(['en', 'ar', 'de']);
    this.translate.onLangChange.subscribe(() => {
      this.updatePageTitle();
    });

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
    this.updatePageTitle();
  }
  private updatePageTitle() {
    this.translate.get('PAGE_TITLE.DASHBOARD').subscribe((translatedTitle: string) => {
      this.titleService.setTitle(translatedTitle);
    });
  }
}
