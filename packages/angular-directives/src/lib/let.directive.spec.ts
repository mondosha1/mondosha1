// Source: https://github.com/ngrx-utils/ngrx-utils/blob/master/projects/store/test/directives/ngLet.spec.ts
import { CommonModule } from '@angular/common'
import { Component, NgModule, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { Observable, of } from 'rxjs'
import { LetDirective } from './let.directive'

@Component({
  template: '',
  selector: 'bt-let-test'
})
class TestComponent {
  @ViewChild(LetDirective) public LetDirective: LetDirective
  public test$: Observable<number>
  public test = 10
  public nestedTest = 20
  public functionTest = (a: number, b: number) => a + b
}

@NgModule({
  declarations: [LetDirective, TestComponent],
  imports: [CommonModule],
  exports: [TestComponent]
})
class TestModule {}

describe('bt directive', () => {
  let fixture: ComponentFixture<TestComponent>

  function getComponent(): TestComponent {
    return fixture.componentInstance
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    })
  })

  afterEach(() => {
    fixture = null!
  })

  it(
    'should work in a template attribute',
    waitForAsync(() => {
      const template = '<span *btLet="test as i">hello{{ i }}</span>'
      fixture = createTestComponent(template)
      getComponent().test = 7
      fixture.detectChanges()
      expect(fixture.debugElement.queryAll(By.css('span')).length).toEqual(1)
      expect(fixture.nativeElement.textContent).toBe('hello7')
    })
  )

  it(
    'should work on a template element',
    waitForAsync(() => {
      const template = '<ng-template [btLet]="test" let-i>hello{{ i }}</ng-template>'
      fixture = createTestComponent(template)
      getComponent().test = 5
      fixture.detectChanges()
      expect(fixture.nativeElement.textContent).toBe('hello5')
    })
  )

  it(
    'should handle nested bt correctly',
    waitForAsync(() => {
      const template = '<div *btLet="test as i"><span *btLet="nestedTest as k">hello{{ i + k }}</span></div>'

      fixture = createTestComponent(template)

      getComponent().test = 3
      getComponent().nestedTest = 5
      fixture.detectChanges()
      expect(fixture.debugElement.queryAll(By.css('span')).length).toEqual(1)
      expect(fixture.nativeElement.textContent).toBe('hello8')
    })
  )

  it(
    'should update several nodes',
    waitForAsync(() => {
      const template =
        '<span *btLet="test + 1; let i">helloNumber{{ i }}</span>' +
        '<span *btLet="functionTest(5, 8) as j">helloFunction{{ j }}</span>'

      fixture = createTestComponent(template)

      getComponent().test = 4
      fixture.detectChanges()
      expect(fixture.debugElement.queryAll(By.css('span')).length).toEqual(2)
      expect(fixture.nativeElement.textContent).toContain('helloNumber5helloFunction13')
    })
  )

  it(
    'should work on async pipe',
    waitForAsync(() => {
      const template = '<span *btLet="test$ | async as t">helloAsync{{ t }}</span>'

      fixture = createTestComponent(template)

      getComponent().test$ = of(15)
      fixture.detectChanges()
      expect(fixture.debugElement.queryAll(By.css('span')).length).toEqual(1)
      expect(fixture.nativeElement.textContent).toContain('helloAsync15')
    })
  )

  it(
    'should accept input',
    waitForAsync(() => {
      const template = '<span *btLet="test as i">hello{{ i }}</span>'

      fixture = createTestComponent(template)
      fixture.detectChanges()

      expect(getComponent().LetDirective).toBeTruthy()
      getComponent().LetDirective.btLet = 21
      fixture.detectChanges()
      expect(fixture.nativeElement.textContent).toContain('hello21')
    })
  )
})

function createTestComponent(template: string): ComponentFixture<TestComponent> {
  return TestBed.overrideComponent(TestComponent, { set: { template } }).createComponent(TestComponent)
}
