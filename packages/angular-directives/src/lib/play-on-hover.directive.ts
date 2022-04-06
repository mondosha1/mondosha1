import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({ selector: 'video[btPlayOnHover]' })
export class PlayOnHoverDirective {
  constructor(private elementRef: ElementRef) {
    this.elementRef.nativeElement.load()
  }

  @HostListener('mouseleave', ['$event.target'])
  private onMouseLeave(video: HTMLVideoElement): void {
    video.pause()
  }

  @HostListener('mouseover', ['$event.target'])
  private onMouseOver(video: HTMLVideoElement): void {
    video.play()
  }
}
