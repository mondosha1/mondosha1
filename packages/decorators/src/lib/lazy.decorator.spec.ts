import { noop } from 'lodash/fp'
import { Lazy } from './lazy.decorator'

class MyTestClass {
  public static instanceGets = 0
  public static staticGets = 0

  @Lazy()
  public static get staticGetterDefault(): number {
    MyTestClass.staticGets++
    return 1
  }

  @Lazy(false)
  public static get staticGetterFalse(): number {
    MyTestClass.staticGets++
    return 1
  }

  @Lazy(true)
  public static get staticGetterTrue(): number {
    MyTestClass.staticGets++
    return 1
  }

  @Lazy()
  public get instanceGetterDefault(): number {
    MyTestClass.instanceGets++
    return 1
  }

  @Lazy(false)
  public get instanceGetterFalse(): number {
    MyTestClass.instanceGets++
    return 1
  }

  @Lazy(true)
  public get instanceGetterTrue(): number {
    MyTestClass.instanceGets++
    return 1
  }

  @Lazy(false)
  public get lazyConfig(): number {
    return 1
  }

  @Lazy(false, true)
  public get lazyNoConfig(): number {
    return 1
  }
}

describe('Lazy decorator', () => {
  beforeEach(() => {
    MyTestClass.staticGets = 0
    MyTestClass.instanceGets = 0
  })

  it('Static getter: false', () => {
    expect(MyTestClass.staticGets).toBe(0)

    noop(MyTestClass.staticGetterFalse)
    expect(MyTestClass.staticGets).toBe(1)

    noop(MyTestClass.staticGetterFalse)
    expect(MyTestClass.staticGets).toBe(1)
  })

  it('Static getter: default', () => {
    expect(MyTestClass.staticGets).toBe(0)

    noop(MyTestClass.staticGetterDefault)
    expect(MyTestClass.staticGets).toBe(1)

    noop(MyTestClass.staticGetterDefault)
    expect(MyTestClass.staticGets).toBe(1)
  })

  it('Static getter: true', () => {
    expect(MyTestClass.staticGets).toBe(0)

    noop(MyTestClass.staticGetterTrue)
    expect(MyTestClass.staticGets).toBe(1)

    noop(MyTestClass.staticGetterTrue)
    expect(MyTestClass.staticGets).toBe(1)
  })

  it('Instance getter: false', () => {
    expect(MyTestClass.instanceGets).toBe(0)

    const inst1 = new MyTestClass()

    noop(inst1.instanceGetterFalse)
    expect(MyTestClass.instanceGets).toBe(1)

    noop(inst1.instanceGetterFalse)
    expect(MyTestClass.instanceGets).toBe(1)

    const inst2 = new MyTestClass()

    noop(inst2.instanceGetterFalse)
    expect(MyTestClass.instanceGets).toBe(2)

    noop(inst2.instanceGetterFalse)
    expect(MyTestClass.instanceGets).toBe(2)
  })

  it('Instance getter: default', () => {
    expect(MyTestClass.instanceGets).toBe(0)

    const inst1 = new MyTestClass()

    noop(inst1.instanceGetterDefault)
    expect(MyTestClass.instanceGets).toBe(1)

    noop(inst1.instanceGetterDefault)
    expect(MyTestClass.instanceGets).toBe(1)

    const inst2 = new MyTestClass()

    noop(inst2.instanceGetterDefault)
    expect(MyTestClass.instanceGets).toBe(2)

    noop(inst2.instanceGetterDefault)
    expect(MyTestClass.instanceGets).toBe(2)
  })

  it('Instance getter: true', () => {
    expect(MyTestClass.instanceGets).toBe(0)

    const inst1 = new MyTestClass()

    noop(inst1.instanceGetterTrue)
    expect(MyTestClass.instanceGets).toBe(1)

    noop(inst1.instanceGetterTrue)
    expect(MyTestClass.instanceGets).toBe(1)

    const inst2 = new MyTestClass()

    noop(inst2.instanceGetterTrue)
    expect(MyTestClass.instanceGets).toBe(1)

    noop(inst2.instanceGetterTrue)
    expect(MyTestClass.instanceGets).toBe(1)
  })

  it('should define the property as configurable', () => {
    const inst = new MyTestClass()
    noop(inst.lazyConfig)

    const lazyConfig = Object.getOwnPropertyDescriptor(inst, 'lazyConfig')
    expect(lazyConfig)
      .toBeDefined()
      .toSatisfy((config: PropertyDescriptor) => {
        expect(config.configurable).toBe(true)
        return true
      })
  })

  it.skip('should define the property as not configurable', () => {
    const inst = new MyTestClass()
    noop(inst.lazyNoConfig)

    const lazyNoConfig = Object.getOwnPropertyDescriptor(inst, 'lazyNoConfig')
    expect(lazyNoConfig)
      .toBeDefined()
      .toSatisfy((config: PropertyDescriptor) => {
        expect(config.configurable).toBe(false)
        return true
      })
  })
})
