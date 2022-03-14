import { fakeAsync, flush, TestBed } from '@angular/core/testing'
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
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

  describe('getIndexesFromParentArray', () => {
    it('should return the index of the given control in its parent form array', () => {
      const formGroup = formBuilder.group({
        cars: formBuilder.array([
          formBuilder.group({
            brand: ['Peugeot'],
            model: ['206']
          })
        ])
      })
      expect(
        FeatureStoreValidators.getIndexesFromParentArray((formGroup.get('cars') as FormArray).at(0).get('brand'))
      ).toEqual({
        $index: 0
      })
    })

    it('should return the indexes of the given control in its parent arrays in depth', () => {
      const formGroup = formBuilder.group({
        cars: formBuilder.array([
          formBuilder.group({
            wheels: formBuilder.array([
              formBuilder.group({
                width: 10,
                height: 20
              })
            ])
          })
        ])
      })

      expect(
        FeatureStoreValidators.getIndexesFromParentArray(
          ((formGroup.get('cars') as FormArray).at(0).get('wheels') as FormArray).at(0).get('width')
        )
      ).toEqual({
        $index: 0,
        $index_1: 0
      })
    })

    it('should return the indexes of the given control in its parent arrays if there are several items', () => {
      const formGroup = formBuilder.group({
        cars: formBuilder.array([
          formBuilder.group({
            wheels: formBuilder.array([
              formBuilder.group({
                width: 10,
                height: 20
              })
            ])
          }),
          formBuilder.group({
            wheels: formBuilder.array([
              formBuilder.group({
                width: 11,
                height: 21
              }),
              formBuilder.group({
                width: 12,
                height: 22
              }),
              formBuilder.group({
                width: 13,
                height: 23
              })
            ])
          })
        ])
      })

      expect(
        FeatureStoreValidators.getIndexesFromParentArray(
          ((formGroup.get('cars') as FormArray).at(1).get('wheels') as FormArray).at(2).get('width')
        )
      ).toEqual({
        $index: 2,
        $index_1: 1
      })
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

    it('should allow validators on neighbor properties in a same form array item', fakeAsync(() => {
      const state$ = new Subject()

      const fillBrandFirst = FeatureStoreValidators.fieldFormulaValidator(
        {
          formula: formula`AND(ISEMPTY(cars[$index].brand), NOT(ISEMPTY(cars[$index].model)))`,
          message: 'You must fill the brand first'
        },
        state$
      )

      const formGroup = formBuilder.group({
        cars: formBuilder.array([
          formBuilder.group({
            brand: [null],
            model: [null, null, fillBrandFirst]
          })
        ])
      })

      formGroup.setValue({ cars: [{ brand: '', model: '206' }] })
      state$.next(formGroup.value)

      flush()

      expect(formGroup.valid).toBe(false)
      expect(formGroup.get('cars.0.brand').valid).toBe(true)
      expect(formGroup.get('cars.0.model').valid).toBe(false)
      expect(formGroup.get('cars.0.model').errors).toEqual({
        featureStoreFormula: {
          errorMessage: 'You must fill the brand first'
        }
      })

      formGroup.setValue({ cars: [{ brand: 'Peugeot', model: '207' }] })
      state$.next(formGroup.value)

      flush()

      expect(formGroup.valid).toBe(true)
      expect(formGroup.get('cars.0.brand').valid).toBe(true)
      expect(formGroup.get('cars.0.model').valid).toBe(true)
      expect(formGroup.get('cars.0.model').errors).toBeNull()
    }))
  })
})

interface Engine {
  name: string
  cylinders: number
  power: number
  valves: number[]
}

interface Bolt {
  length: number
  diameter: number
}

interface Wheel {
  width: number
  height: number
  diameter: number
  bolts: Bolt[]
}

interface Car {
  brand: string
  model: string
  manualTransmission: boolean
  engine: Partial<Engine>
  wheels: Wheel[]
}
