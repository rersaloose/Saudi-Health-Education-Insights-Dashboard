import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appAutoResize]',
  standalone: true,
})
export class AutoResizeDirective implements OnInit, OnDestroy {
  @Output() resized = new EventEmitter<DOMRectReadOnly>();

  private resizeObserver: ResizeObserver | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.resized.emit(entry.contentRect);
        }
      });

      this.resizeObserver.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
