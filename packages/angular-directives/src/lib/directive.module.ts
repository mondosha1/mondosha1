import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ClickOutsideDirective } from './click-outside.directive'
import { ImgPlaceholderDirective } from './img-placeholder.directive'
import { LetDirective } from './let.directive'
import { PlayOnHoverDirective } from './play-on-hover.directive'
import { ScrollDirective } from './scroll.directive'
import { StopPropagationDirective } from './stop-propagation.directive'

@NgModule({
  declarations: [
    LetDirective,
    ClickOutsideDirective,
    ImgPlaceholderDirective,
    PlayOnHoverDirective,
    ScrollDirective,
    StopPropagationDirective
  ],
  exports: [
    LetDirective,
    ClickOutsideDirective,
    ImgPlaceholderDirective,
    PlayOnHoverDirective,
    ScrollDirective,
    StopPropagationDirective
  ],
  imports: [CommonModule]
})
export class DirectiveModule {}
