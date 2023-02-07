import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core'
import { Many, wrapIntoArray } from '@mondosha1/array'
import { of } from '@mondosha1/core'
import { fold, Nullable } from '@mondosha1/nullable'
import { some } from 'lodash/fp'

@Directive({
  selector: '[btClickOutside]'
})
export class ClickOutsideDirective {
  @Output('btClickOutside') public clickOutside = new EventEmitter<MouseEvent>()
  @Input('btClickOutsideAllowList') public btClickOutsideAllowList?: Nullable<Many<Element>>

  public constructor(private _elementRef: ElementRef) {}

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return
    }
    const containedInAllowList = of(this.btClickOutsideAllowList).pipe(
      wrapIntoArray,
      fold(
        false,
        some(elt => elt.contains(targetElement))
      )
    )
    const clickedInside = containedInAllowList || this._elementRef.nativeElement.contains(targetElement)
    if (!clickedInside) {
      this.clickOutside.emit(event)
    }
  }
}
