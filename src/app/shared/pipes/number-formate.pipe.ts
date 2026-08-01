import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberFormat', standalone: true })
export class NumberFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 1000) return value.toLocaleString('en-US');
    return value.toString();
  }
}
