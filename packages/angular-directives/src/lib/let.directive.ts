// Source: https://github.com/ngrx-utils/ngrx-utils/blob/master/projects/store/src/directives/ngLet.ts
import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core'

export class BtLetContext {
  public $implicit: any = null
  public btLet: any = null
}

@Directive({
  selector: '[btLet]'
})
export class LetDirective implements OnInit {
  private context = new BtLetContext()

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<BtLetContext>) {}

  @Input()
  public set btLet(value: any) {
    this.context.$implicit = this.context.btLet = value
  }

  public ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.templateRef, this.context)
  }
}
