import { fakeAsync, flush, TestBed } from '@angular/core/testing'
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { of as rxOf, Subject } from 'rxjs'
import { formula } from './feature-store.formula'
import { FeatureStoreValidators } from './feature-store.validators'

describe('FeatureStoreValidators', () => {
  let formBuilder: FormBuilder

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule]
    })
    formBuilder = TestBed.inject(FormBuilder)
  })

  it('should be created', () => {
    expect(FeatureStoreValidators).toBeDefined()
  })

  describe('evaluateExpression', () => {
    it('should', () => {
      expect(true).toBe(true)
    })
  })

  describe('featureStoreValidator', () => {
    it('should', () => {
      expect(true).toBe(true)
    })
  })

  describe('fieldFormulaValidator', () => {
    it('should evaluate the formula to define if the control is valid or not', fakeAsync(() => {
      const alwaysInvalid = FeatureStoreValidators.fieldFormulaValidator(
        { formula: formula`true`, message: "I'm always invalid" },
        rxOf({})
      )
      const alwaysValid = FeatureStoreValidators.fieldFormulaValidator(
        { formula: formula`false`, message: "I'm always valid" },
        rxOf({})
      )
      const brand = formBuilder.control(null, null, alwaysValid)
      const model = formBuilder.control(null, null, alwaysInvalid)

      flush()

      expect(brand.valid).toBe(true)
      expect(model.valid).toBe(false)
      expect(model.errors).toEqual({
        featureStoreFormula: {
          errorMessage: "I'm always invalid"
        }
      })
    }))

    it('should use state values in formula to determine validity', fakeAsync(() => {
      const state$ = new Subject()

      const fillBrandFirst = FeatureStoreValidators.fieldFormulaValidator(
        { formula: formula`AND(ISEMPTY(brand), NOT(ISEMPTY(model)))`, message: 'You must fill the brand first' },
        state$
      )

      const formGroup = formBuilder.group({
        brand: [null],
        model: [null, null, fillBrandFirst]
      })

      formGroup.setValue({ brand: '', model: '206' })
      state$.next(formGroup.value)

      flush()

      expect(formGroup.valid).toBe(false)
      expect(formGroup.get('brand').valid).toBe(true)
      expect(formGroup.get('model').valid).toBe(false)
      expect(formGroup.get('model').errors).toEqual({
        featureStoreFormula: {
          errorMessage: 'You must fill the brand first'
        }
      })
    }))
  })
})
