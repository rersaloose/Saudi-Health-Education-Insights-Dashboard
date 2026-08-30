import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageCode, TranslationService } from './core/services/TranslationService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly transSvc = inject(TranslationService);
  protected readonly title = signal('ksauhs-dashboard');
  onLangChange(event: Event) {
    const lang = (event.target as HTMLSelectElement).value as LanguageCode;
    this.transSvc.changeLang(lang);
  }
}
