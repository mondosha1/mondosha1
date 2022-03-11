import { TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { of } from '@mondosha1/core'
import { StoreModule } from '@ngrx/store'
import { defaults } from 'lodash/fp'
import { FeatureStoreFacade, FeatureStoreFacadeFactory } from './feature-store.facade'
import { FEATURE_STORE_OPTIONS, withFeatureStoreState } from './feature-store.state'
import { Structure, ValidatorName } from './feature-store.structure'

describe('FeatureStoreFacade', () => {
  let featureStoreFacadeFactory: FeatureStoreFacadeFactory

  const CAR_FEATURE_STORE_KEY: string = 'car'
  const carState = withFeatureStoreState<Car>({
    brand: 'Peugeot',
    model: '208',
    manualTransmission: true,
    engine: {
      name: '1.6 THP',
      power: 200,
      cylinders: 1598,
      valves: []
    },
    wheels: []
  })

  const carStructure: Structure<Car> = {
    brand: {
      type: 'string',
      validators: ValidatorName.Required
    },
    model: 'string',
    manualTransmission: 'boolean',
    engine: {
      name: {
        type: 'string',
        validators: ValidatorName.Required
      },
      cylinders: 'number',
      power: 'number',
      valves: {
        items: 'number',
        type: 'array'
      }
    },
    wheels: {
      type: 'array',
      items: {
        width: 'number',
        height: 'number',
        diameter: 'number'
      },
      validators: [
        { name: ValidatorName.MinLength, params: { minLength: 4 } },
        { name: ValidatorName.MaxLength, params: { maxLength: 4 } }
      ]
    }
  }

  async function configureModule(options?: {
    initialState?: {}
    structure?: Structure<any>
    structurePathsForForm?: string[]
  }) {
    TestBed.resetTestingModule()
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, StoreModule.forRoot({})],
      providers: [
        FeatureStoreFacadeFactory,
        {
          provide: FEATURE_STORE_OPTIONS,
          useValue: of({
            featureStoreKey: CAR_FEATURE_STORE_KEY
          }).pipe(
            defaults(options),
            defaults({
              initialState: carState,
              structure: carStructure,
              structurePathsForForm: []
            })
          )
        }
      ]
    }).compileComponents()
    featureStoreFacadeFactory = TestBed.inject(FeatureStoreFacadeFactory as any)
  }

  beforeEach(async () => configureModule())

  it('should be created', () => {
    expect(featureStoreFacadeFactory).toBeDefined()
  })
})

interface Engine {
  name: string
  cylinders: number
  power: number
  valves: number[]
}

interface Wheel {
  width: number
  height: number
  diameter: number
}

interface Car {
  brand: string
  model: string
  manualTransmission: boolean
  engine: Engine
  wheels: Wheel[]
}
