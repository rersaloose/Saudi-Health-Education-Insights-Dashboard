import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  readonly showYearFilter = signal<boolean>(false);

  setYearFilterVisibility(visible: boolean): void {
    this.showYearFilter.set(visible);
  }
}
