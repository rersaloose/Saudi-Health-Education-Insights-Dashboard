import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-state.html',
  styleUrl: './card-state.css',
})
export class CardState {
  loading = input.required<boolean>();
  hasData = input.required<boolean>();
  hasError = input<boolean>(false);
}
