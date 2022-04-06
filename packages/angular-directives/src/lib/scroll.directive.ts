import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core'
import { Throttle } from '@mondosha1/decorators'

@Directive({ selector: '[btScroll]' })
export class ScrollDirective {
  @Output() public btScroll: EventEmitter<number> = new EventEmitter<number>()

  public constructor(public readonly elementRef: ElementRef) {}

  @HostListener('scroll')
  public onScrollListener(): void {
    this.emitScrollEvent()
  }

  public scrollTo(offset: number, duration: number = 300): void {
    $(this.elementRef.nativeElement).animate({ scrollTop: offset }, duration)
  }

  @Throttle(150)
  private emitScrollEvent() {
    this.btScroll.emit(this.elementRef.nativeElement.scrollTop)
  }
}
