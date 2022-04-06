import { ChangeDetectorRef, Directive, HostBinding, Input, OnInit } from '@angular/core'

@Directive({
  selector: '[btImgPlaceholder]'
})
export class ImgPlaceholderDirective implements OnInit {
  @HostBinding('attr.src') public finalImage: string
  @Input('btImgPlaceholder') public targetSource: string
  @Input() public defaultImage: string

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit() {
    if (this.defaultImage) {
      this.finalImage = this.defaultImage
    }

    if (this.targetSource) {
      const downloadingImage = new Image()
      downloadingImage.onload = () => {
        this.finalImage = this.targetSource
        this.changeDetectorRef.markForCheck()
      }
      downloadingImage.src = this.targetSource
    }
  }
}
