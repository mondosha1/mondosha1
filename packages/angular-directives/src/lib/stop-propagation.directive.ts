import { Directive, HostListener } from '@angular/core'

@Directive({
  selector: '[btStopPropagation]'
})
export class StopPropagationDirective {
  @HostListener('dblclick', ['$event'])
  public dblClick(event: MouseEvent): void {
    event.stopPropagation()
  }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.stopPropagation()
  }
}
