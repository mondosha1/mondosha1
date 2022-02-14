import { TestBed } from '@angular/core/testing'
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms'
import { EXPR_EVAL_EXPRESSION } from '@elium/shared/util'
import { of as _of } from '@mondosha1/core'
import { Nullable } from '@mondosha1/nullable'
import { get, PartialDeep } from '@mondosha1/object'
import { firstValue } from '@mondosha1/observable'
import { Store } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { getOr, omit, values } from 'lodash/fp'
import { Observable, of } from 'rxjs'
import { FeatureStoreFormBuilder, FeatureStoreFormFactory } from './feature-store.form'
import { FeatureStoreModule } from './feature-store.module'
import { withFeatureStoreState } from './feature-store.state'
import { FieldGroup, Structure, ValidatorName } from './feature-store.structure'

const CAR_FEATURE_STORE_KEY = 'car'

export interface CarStoreState {
  [CAR_FEATURE_STORE_KEY]: Car
}

describe('FeatureStoreFormFactory', () => {
  let featureStoreFormFactory: FeatureStoreFormFactory
  let featureStoreFormBuilder: FeatureStoreFormBuilder<Car>
  let store: MockStore<CarStoreState>
  const destroy$ = of<void>()
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
        diameter: 'number',
        bolts: {
          type: 'array',
          items: {
            length: 'number',
            diameter: 'number'
          }
        }
      },
      validators: [
        { name: ValidatorName.MinLength, params: { minLength: 4 } },
        { name: ValidatorName.MaxLength, params: { maxLength: 4 } }
      ]
    }
  }

  async function configureModule(options?: {
    initialState?: Partial<Car>
    structure?: Structure<any>
    structurePathsForForm?: string[]
  }) {
    TestBed.resetTestingModule()
    const initialState = _of(options).pipe(getOr(carState, 'initialState')) as Car
    const structure = _of(options).pipe(getOr(carStructure, 'structure'))
    const structurePathsForForm = _of(options).pipe(get('structurePathsForForm'))
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FeatureStoreModule.forRoot({
          featureStoreKey: CAR_FEATURE_STORE_KEY,
          initialState,
          structure,
          structurePathsForForm
        })
      ],
      providers: [
        provideMockStore<CarStoreState>({
          initialState: {
            [CAR_FEATURE_STORE_KEY]: initialState
          }
        })
      ]
    }).compileComponents()
    featureStoreFormFactory = TestBed.inject(FeatureStoreFormFactory as any)
    featureStoreFormBuilder = featureStoreFormFactory.getFormBuilder<Car>(CAR_FEATURE_STORE_KEY)
    store = TestBed.inject(Store) as MockStore<CarStoreState>
  }

  beforeEach(async () => configureModule())

  it('should be created', () => {
    expect(featureStoreFormBuilder).toBeDefined()
  })

  describe('getDefaultValue', () => {
    it('should return the value at the given simple path', () => {
      const value = featureStoreFormBuilder.getInitialValue('brand')
      expect(value).toBe('Peugeot')
    })

    it('should return the value at the given deep path', () => {
      const value = featureStoreFormBuilder.getInitialValue('engine.cylinders')
      expect(value).toBe(1598)
    })
  })

  describe('create', () => {
    it('should create a form group from the whole structure if no structure paths if given', () => {
      const formGroup = featureStoreFormBuilder.create({ takeUntil$: destroy$ })
      expect(formGroup).toBeInstanceOf(FormGroup)
      expect(formGroup.controls)
        .toBeObject()
        .toContainAllKeys(['brand', 'model', 'manualTransmission', 'engine', 'wheels'])
        .toSatisfy(controlsByKey => {
          expect(values(controlsByKey)).toSatisfyAll(control => {
            expect(control).toBeInstanceOf(AbstractControl)
            return true
          })
          return true
        })
      expect(formGroup.controls.engine).toBeInstanceOf(FormGroup)
      expect((formGroup.controls.engine as FormGroup).controls)
        .toBeObject()
        .toContainAllKeys(['name', 'cylinders', 'power', 'valves'])
        .toSatisfy(controlsByKey => {
          expect(values(controlsByKey)).toSatisfyAll(control => {
            expect(control).toBeInstanceOf(AbstractControl)
            return true
          })
          return true
        })
      expect(formGroup.controls.wheels).toBeInstanceOf(FormArray)
      expect((formGroup.controls.wheels as FormArray).controls)
        .toSatisfyAll(group => {
          expect(group).toBeInstanceOf(FormGroup)
          return true
        })
        .toSatisfyAll(group => {
          expect(group.controls)
            .toBeObject()
            .toContainAllKeys(['width', 'height', 'diameter'])
            .toSatisfy(controlsByKey => {
              expect(values(controlsByKey)).toSatisfyAll(control => {
                expect(control).toBeInstanceOf(AbstractControl)
                return true
              })
              return true
            })
          return true
        })
    })

    it('should create a form group picking only the structure paths if given', async () => {
      await configureModule({
        structurePathsForForm: ['model', 'manualTransmission', 'engine.name', 'engine.power', 'engine.valves']
      })
      const formGroup = featureStoreFormBuilder.create({ takeUntil$: destroy$ })
      expect(formGroup).toBeInstanceOf(FormGroup)
      expect(formGroup.controls)
        .toBeObject()
        .toContainAllKeys(['model', 'manualTransmission', 'engine'])
        .not.toContainKeys(['brand', 'wheels'])
        .toSatisfy(controlsByKey => {
          expect(values(controlsByKey)).toSatisfyAll(control => {
            expect(control).toBeInstanceOf(AbstractControl)
            return true
          })
          return true
        })
      expect(formGroup.controls.engine).toBeInstanceOf(FormGroup)
      expect((formGroup.controls.engine as FormGroup).controls)
        .toBeObject()
        .toContainAllKeys(['name', 'power', 'valves'])
        .not.toContainKey('cylinders')
        .toSatisfy(controlsByKey => {
          expect(values(controlsByKey)).toSatisfyAll(control => {
            expect(control).toBeInstanceOf(AbstractControl)
            return true
          })
          return true
        })
    })

    it('should initialize the form values with the initial state', async () => {
      const formGroup = featureStoreFormBuilder.create({ takeUntil$: destroy$ })
      expect(formGroup.value).toEqual({
        brand: 'Peugeot',
        engine: {
          cylinders: 1598,
          name: '1.6 THP',
          power: 200,
          valves: []
        },
        manualTransmission: true,
        model: '208',
        wheels: []
      })
    })

    it('should update the form values on state changes', async () => {
      const formGroup = featureStoreFormBuilder.create({ takeUntil$: destroy$ })

      store.setState({
        [CAR_FEATURE_STORE_KEY]: {
          ...carState,
          brand: 'Renault',
          model: 'Clio',
          engine: {
            name: 'IV R.S.',
            power: 203,
            cylinders: 1998
          } as Engine
        } as Car
      })

      store.refreshState()

      expect(formGroup.value).toEqual({
        brand: 'Renault',
        engine: {
          cylinders: 1998,
          name: 'IV R.S.',
          power: 203,
          valves: []
        },
        manualTransmission: true,
        model: 'Clio',
        wheels: []
      })
    })

    it('should update the form values with form arrays on state changes', async () => {
      const formGroup = featureStoreFormBuilder.create({ takeUntil$: destroy$ })

      store.setState({
        [CAR_FEATURE_STORE_KEY]: {
          ...carState,
          wheels: [
            {
              width: 255,
              height: 40,
              diameter: 13,
              bolts: []
            },
            {
              width: 265,
              height: 42,
              diameter: 14,
              bolts: []
            }
          ]
        }
      })

      store.refreshState()

      expect(formGroup.value).toEqual({
        brand: 'Peugeot',
        engine: {
          cylinders: 1598,
          name: '1.6 THP',
          power: 200,
          valves: []
        },
        manualTransmission: true,
        model: '208',
        wheels: [
          {
            width: 255,
            height: 40,
            diameter: 13,
            bolts: []
          },
          {
            width: 265,
            height: 42,
            diameter: 14,
            bolts: []
          }
        ]
      })
    })

    it('should throw an error if the form group is injected in a module without takeUntil$ option', () => {
      expect(() => featureStoreFormBuilder.create()).toThrowError('The "takeUntil$" option is mandatory')
    })
  })

  describe('getFormArrayPaths', () => {
    it('should return the list of paths of form arrays present in the structure', async () => {
      let paths: string[]
      paths = featureStoreFormBuilder.getFormArrayPaths(
        {
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
        },
        carState
      )
      expect(paths).toIncludeAllMembers(['wheels'])

      paths = featureStoreFormBuilder.getFormArrayPaths(
        {
          wheels: {
            type: 'array',
            items: {
              width: 'number',
              height: 'number',
              diameter: 'number'
            }
          }
        },
        carState
      )
      expect(paths).toIncludeAllMembers(['wheels'])

      paths = featureStoreFormBuilder.getFormArrayPaths(
        {
          matrix: {
            type: 'array',
            items: {
              row: {
                type: 'array',
                items: {
                  column: 'number'
                }
              }
            }
          }
        },
        carState
      )
      expect(paths).toIncludeAllMembers(['matrix'])
    })

    it('should return paths from flatten array values', async () => {
      const carStateWithWheeldsAndBolts = {
        ...carState,
        wheels: [
          {
            width: 255,
            height: 40,
            diameter: 13,
            bolts: [
              {
                length: 56,
                diameter: 19
              }
            ]
          },
          {
            width: 255,
            height: 40,
            diameter: 13,
            bolts: [
              {
                length: 56,
                diameter: 19
              }
            ]
          }
        ]
      }

      let paths: string[]
      paths = featureStoreFormBuilder.getFormArrayPaths(
        {
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
              diameter: 'number',
              bolts: {
                type: 'array',
                items: {
                  length: 'number',
                  diameter: 'number'
                }
              }
            },
            validators: [
              { name: ValidatorName.MinLength, params: { minLength: 4 } },
              { name: ValidatorName.MaxLength, params: { maxLength: 4 } }
            ]
          }
        },
        carStateWithWheeldsAndBolts
      )
      expect(paths).toIncludeAllMembers(['wheels', 'wheels.0.bolts', 'wheels.1.bolts'])

      paths = featureStoreFormBuilder.getFormArrayPaths(
        {
          wheels: {
            type: 'array',
            items: {
              width: 'number',
              height: 'number',
              diameter: 'number',
              bolts: {
                type: 'array',
                items: {
                  length: 'number',
                  diameter: 'number'
                }
              }
            }
          }
        },
        carStateWithWheeldsAndBolts
      )
      expect(paths).toIncludeAllMembers(['wheels'])
    })

    it('should return an empty array if no form arrays present in the structure', async () => {
      let paths: string[]

      paths = featureStoreFormBuilder.getFormArrayPaths(
        {
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
            power: 'number'
          }
        },
        carState
      )
      expect(paths).toBeArray().toBeEmpty()

      paths = featureStoreFormBuilder.getFormArrayPaths(
        {
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
          }
        },
        carState
      )
      expect(paths).toBeArray().toBeEmpty()
    })
  })

  describe('createArrayItem', () => {
    it('should create a form array item as a form group corresponding to the given structure', () => {
      const formGroup = featureStoreFormBuilder.createArrayItem('wheels')
      expect(formGroup).toBeInstanceOf(FormGroup)
      expect(formGroup.controls)
        .toBeObject()
        .toContainAllKeys(['width', 'height', 'diameter', 'bolts'])
        .toSatisfy(controlsByKey => {
          expect(values(controlsByKey)).toSatisfyAll(control => {
            expect(control).toBeInstanceOf(AbstractControl)
            return true
          })
          return true
        })
    })

    it('should throw an error trying to create an item with a field path not corresponding to a field array', () => {
      expect(() => featureStoreFormBuilder.createArrayItem('brand')).toThrowWithMessage(
        Error,
        'Array item creation expects to give an array Field definition'
      )
      expect(() => featureStoreFormBuilder.createArrayItem('model')).toThrowWithMessage(
        Error,
        'Array item creation expects to give an array Field definition'
      )
      expect(() => featureStoreFormBuilder.createArrayItem('engine')).toThrowWithMessage(
        Error,
        'Array item creation expects to give an array Field definition'
      )
    })

    it('should throw an error trying to create an item with a field path corresponding to a field with simple items', () => {
      expect(() => featureStoreFormBuilder.createArrayItem('engine.valves')).toThrowWithMessage(
        Error,
        'Array item creation expects to give a Field definition with field groups items'
      )
    })

    it('should create a form array item as a form group without default value if several values defined in default state', async () => {
      await configureModule({
        initialState: {
          wheels: [
            {
              width: 255,
              height: 40,
              diameter: 13,
              bolts: []
            },
            {
              width: 255,
              height: 40,
              diameter: 13,
              bolts: []
            }
          ]
        }
      })
      const formGroup = featureStoreFormBuilder.createArrayItem('wheels')
      expect(formGroup.value).toEqual({
        width: null,
        height: null,
        diameter: null,
        bolts: []
      })
    })

    it('should create a form array item as a form group with default value if only one value defined in default state', async () => {
      await configureModule({
        initialState: {
          wheels: [
            {
              width: 255,
              height: 40,
              diameter: 13,
              bolts: []
            }
          ]
        }
      })
      const formGroup = featureStoreFormBuilder.createArrayItem('wheels')
      expect(formGroup.value).toEqual({
        width: 255,
        height: 40,
        diameter: 13,
        bolts: []
      })
    })
  })

  describe('createControl', () => {
    describe('with a field type', () => {
      it('should create a form control corresponding to the field type', () => {
        const formControl = featureStoreFormBuilder.createControl(carStructure.model) as FormControl
        expect(formControl).toBeInstanceOf(FormControl)
        expect(formControl.validator).toBeNull()
      })

      it('should create a form control from a field type and with the default value', () => {
        const formControl = featureStoreFormBuilder.createControl(carStructure.model, 'model') as FormControl
        expect(formControl.value).toBe('208')
        expect(formControl.validator).toBeNull()
      })
    })

    describe('with a simple field', () => {
      it('should create a form control corresponding to the field', () => {
        const formControl = featureStoreFormBuilder.createControl(carStructure.brand) as FormControl
        expect(formControl).toBeInstanceOf(FormControl)
      })

      it('should create a form control from a field and with the default value', () => {
        const formControl = featureStoreFormBuilder.createControl(carStructure.brand, 'brand') as FormControl
        expect(formControl.value).toBe('Peugeot')
      })

      it('should create a form control from a field and with validators', async () => {
        const formControl = featureStoreFormBuilder.createControl(carStructure.brand) as FormControl
        expect(formControl.validator).toBeNull() // Only use async validators
        expect(formControl.asyncValidator).not.toBeNull()

        // Check required validator presence
        const validator = formControl.asyncValidator as (
          control: AbstractControl
        ) => Observable<Nullable<ValidationErrors>>

        expect(await firstValue(validator({ value: '' } as AbstractControl))).toEqual({
          required: true
        })

        expect(await firstValue(validator({ value: 'helloworld' } as AbstractControl))).toBeNull()
      })

      it('should create a form control from a field and with custom validator', async () => {
        const formGroup = featureStoreFormBuilder.createControl({
          model: {
            type: 'string',
            validators: {
              formula: 'model != "Clio"' as EXPR_EVAL_EXPRESSION,
              message: 'Wrong car model, "Clio" expected'
            }
          }
        }) as FormGroup
        const formControl = formGroup.get('model') as FormControl
        expect(formControl.validator).toBeNull() // Only use async validators
        expect(formControl.asyncValidator).not.toBeNull()

        // Check required validator presence
        const validator = formControl.asyncValidator as (
          control: AbstractControl
        ) => Observable<Nullable<ValidationErrors>>

        expect(await firstValue(validator({ value: '' } as AbstractControl))).toEqual({
          featureStoreFormula: {
            errorMessage: 'Wrong car model, "Clio" expected'
          }
        })

        expect(await firstValue(validator({ value: 'Clio' } as AbstractControl))).toBeNull()
      })

      it('should create a form control from a field and with custom validator depending on other fields', async () => {
        const formGroup = featureStoreFormBuilder.createControl(
          {
            model: {
              type: 'string',
              validators: {
                formula:
                  'OR(AND(brand == "Peugeot", model == "Clio"), AND(brand == "Renault", model == "206"))' as EXPR_EVAL_EXPRESSION,
                message: 'Wrong car model for the selected brand'
              }
            }
          },
          null,
          of({
            brand: 'Renault',
            model: ''
          } as Car)
        ) as FormGroup
        const formControl = formGroup.get('model') as FormControl
        expect(formControl.validator).toBeNull() // Only use async validators
        expect(formControl.asyncValidator).not.toBeNull()

        // Check required validator presence
        const validator = formControl.asyncValidator as (
          control: AbstractControl
        ) => Observable<Nullable<ValidationErrors>>

        expect(await firstValue(validator({ value: 'Clio' } as AbstractControl))).toBeNull()

        expect(await firstValue(validator({ value: '206' } as AbstractControl))).toEqual({
          featureStoreFormula: {
            errorMessage: 'Wrong car model for the selected brand'
          }
        })
      })

      it('should create a form control from a field and with a conditioned default validator', async () => {
        const getValidator = brand =>
          featureStoreFormBuilder
            .createControl(
              {
                model: {
                  type: 'string',
                  validators: {
                    name: ValidatorName.Required,
                    condition: 'brand == "Peugeot"' as EXPR_EVAL_EXPRESSION
                  }
                }
              },
              null,
              of({
                brand,
                model: ''
              } as Car)
            )
            .get('model').asyncValidator as (control: AbstractControl) => Observable<Nullable<ValidationErrors>>

        let validator = getValidator('Peugeot')
        expect(await firstValue(validator({ value: '' } as AbstractControl))).toEqual({
          required: true
        })
        expect(await firstValue(validator({ value: '206' } as AbstractControl))).toBeNull()

        validator = getValidator('Renault')
        expect(await firstValue(validator({ value: '' } as AbstractControl))).toBeNull()
        expect(await firstValue(validator({ value: 'Clio' } as AbstractControl))).toBeNull()
      })
    })

    describe('with an array field', () => {
      it('should create a form array if the field type is array and the items are not simple types', () => {
        const formArray = featureStoreFormBuilder.createControl(carStructure.wheels) as FormArray
        expect(formArray).toBeInstanceOf(FormArray)
      })

      it('should create a form array with default values if the field type is array and the items are not simple types', async () => {
        await configureModule({
          initialState: {
            wheels: [
              {
                width: 255,
                height: 40,
                diameter: 13,
                bolts: []
              },
              {
                width: 255,
                height: 40,
                diameter: 13,
                bolts: []
              },
              {
                width: 255,
                height: 40,
                diameter: 13,
                bolts: []
              },
              {
                width: 255,
                height: 40,
                diameter: 13,
                bolts: []
              }
            ]
          }
        })
        const formArray = featureStoreFormBuilder.createControl(carStructure.wheels, 'wheels') as FormArray
        expect(formArray.controls)
          .toBeArrayOfSize(4)
          .toSatisfyAll(group => {
            expect(group).toBeInstanceOf(FormGroup)
            return true
          })
          .toSatisfyAll(group => {
            expect(group.controls)
              .toBeObject()
              .toContainAllKeys(['width', 'height', 'diameter', 'bolts'])
              .toSatisfy(controlsByKey => {
                expect(values(controlsByKey)).toSatisfyAll(control => {
                  expect(control).toBeInstanceOf(AbstractControl)
                  return true
                })
                return true
              })
            return true
          })
          .toSatisfyAll(group => {
            expect(group.value).toEqual({
              width: 255,
              height: 40,
              diameter: 13,
              bolts: []
            })
            return true
          })
        expect(formArray.value).toEqual([
          {
            width: 255,
            height: 40,
            diameter: 13,
            bolts: []
          },
          {
            width: 255,
            height: 40,
            diameter: 13,
            bolts: []
          },
          {
            width: 255,
            height: 40,
            diameter: 13,
            bolts: []
          },
          {
            width: 255,
            height: 40,
            diameter: 13,
            bolts: []
          }
        ])
      })

      it('should create nested form arrays with if the structure defines nested complex arrays', async () => {
        await configureModule({
          initialState: {
            wheels: [
              {
                width: 255,
                height: 40,
                diameter: 13,
                bolts: [
                  {
                    length: 56,
                    diameter: 19
                  }
                ]
              }
            ]
          }
        })
        const wheelsFormArray = featureStoreFormBuilder.createControl(carStructure.wheels, 'wheels') as FormArray
        expect(wheelsFormArray.controls).toBeArrayOfSize(1)
        const boltsFormArray = (wheelsFormArray.controls[0] as FormGroup).controls.bolts as FormArray
        expect(boltsFormArray).toBeInstanceOf(FormArray)
        expect(boltsFormArray.controls)
          .toBeArrayOfSize(1)
          .toSatisfyAll(group => {
            expect(group.value).toEqual({
              length: 56,
              diameter: 19
            })
            return true
          })
        expect(wheelsFormArray.value).toEqual([
          {
            width: 255,
            height: 40,
            diameter: 13,
            bolts: [
              {
                length: 56,
                diameter: 19
              }
            ]
          }
        ])
      })

      it('should update the form values with form arrays on state changes', async () => {
        const formGroup = featureStoreFormBuilder.create({ takeUntil$: destroy$ })

        store.setState({
          [CAR_FEATURE_STORE_KEY]: {
            ...carState,
            wheels: [
              {
                width: 255,
                height: 40,
                diameter: 13,
                bolts: [
                  {
                    length: 56,
                    diameter: 19
                  }
                ]
              }
            ]
          }
        })

        store.refreshState()

        expect(formGroup.value).toEqual({
          brand: 'Peugeot',
          engine: {
            cylinders: 1598,
            name: '1.6 THP',
            power: 200,
            valves: []
          },
          manualTransmission: true,
          model: '208',
          wheels: [
            {
              width: 255,
              height: 40,
              diameter: 13,
              bolts: [
                {
                  length: 56,
                  diameter: 19
                }
              ]
            }
          ]
        })
      })

      it('should create a form array with validators if the field type is array and the items are not simple types', async () => {
        const formArray = featureStoreFormBuilder.createControl(carStructure.wheels) as FormArray
        expect(formArray.validator).toBeNull() // Only use async validators
        expect(formArray.asyncValidator).not.toBeNull()

        // Check minLength validator presence
        const validator = formArray.asyncValidator as (
          control: AbstractControl
        ) => Observable<Nullable<ValidationErrors>>
        expect(await firstValue(validator({ value: [1, 2, 3] } as AbstractControl))).toEqual({
          minlength: {
            actualLength: 3,
            requiredLength: 4
          }
        })

        // Check maxLength validator presence
        expect(await firstValue(validator({ value: [1, 2, 3, 4, 5] } as AbstractControl))).toEqual({
          maxlength: {
            actualLength: 5,
            requiredLength: 4
          }
        })

        // Check maxLength validator presence
        expect(await firstValue(validator({ value: [1, 2, 3, 4] } as AbstractControl))).toBeNull()
      })

      it('should create a form control if the field type is array and the items are simple types', () => {
        const formControl = featureStoreFormBuilder.createControl(
          (carStructure.engine as FieldGroup<Engine>).valves
        ) as FormControl
        expect(formControl).toBeInstanceOf(FormControl)
      })

      it('should create a form control with default values if the field type is array and the items are simple types', async () => {
        await configureModule({
          initialState: {
            engine: {
              valves: [4, 4, 4, 4]
            }
          }
        })
        const formControl = featureStoreFormBuilder.createControl(
          (carStructure.engine as FieldGroup<Engine>).valves,
          'engine.valves'
        ) as FormControl
        expect(formControl.value).toEqual([4, 4, 4, 4])
      })

      it('should create a form group corresponding to the given structure', () => {
        const formGroup = featureStoreFormBuilder.createControl()
        expect(formGroup).toBeInstanceOf(FormGroup)
      })
    })

    describe('with a field group', () => {
      it('should create a form group corresponding to the field group', () => {
        const formGroup = featureStoreFormBuilder.createControl(carStructure.engine) as FormGroup
        expect(formGroup).toBeInstanceOf(FormGroup)
      })

      it('should create a form control, group or array for each key _of the form group', () => {
        const formGroup = featureStoreFormBuilder.createControl(carStructure.engine) as FormGroup
        expect(formGroup.controls)
          .toBeObject()
          .toContainAllKeys(['name', 'power', 'cylinders', 'valves'])
          .toSatisfy(controlsByKey => {
            expect(values(controlsByKey)).toSatisfyAll(control => {
              expect(control).toBeInstanceOf(AbstractControl)
              return true
            })
            return true
          })
      })

      it('should create a form group from a field group and with the default value', () => {
        const formGroup = featureStoreFormBuilder.createControl(carStructure.engine, 'engine') as FormGroup
        expect(formGroup.value).toEqual({
          name: '1.6 THP',
          power: 200,
          cylinders: 1598,
          valves: []
        })
      })
    })

    describe('with a structure', () => {
      it('should create a form group corresponding to the structure', () => {
        const formGroup = featureStoreFormBuilder.createControl() as FormGroup
        expect(formGroup).toBeInstanceOf(FormGroup)
      })

      it('should pass the structure as default parameter if no pieceOfStructure is given', () => {
        const formGroup = featureStoreFormBuilder.createControl() as FormGroup
        expect(formGroup).toBeInstanceOf(FormGroup)
      })

      it('should create a form control, group or array for each key _of the form group', () => {
        const formGroup = featureStoreFormBuilder.createControl() as FormGroup
        expect(formGroup.controls)
          .toBeObject()
          .toContainAllKeys(['brand', 'model', 'manualTransmission', 'engine', 'wheels'])
          .toSatisfy(controlsByKey => {
            expect(values(controlsByKey)).toSatisfyAll(control => {
              expect(control).toBeInstanceOf(AbstractControl)
              return true
            })
            return true
          })
      })

      it('should create a form group from a structure and with the default value', () => {
        const formGroup = featureStoreFormBuilder.createControl() as FormGroup
        expect(formGroup.value).toEqual(_of(carState).pipe(omit('$meta')))
      })
    })
  })

  describe('extendState', () => {
    it('should extend missing control values from given state', () => {
      const extendedState = _of({
        brand: 'Peugeot'
      }).pipe(
        FeatureStoreFormBuilder.extendState<Partial<Car>>(
          {
            brand: 'Renault',
            model: '208'
          },
          {
            brand: {
              type: 'string',
              validators: ValidatorName.Required
            },
            model: 'string'
          }
        )
      )

      expect(extendedState).toEqual({
        brand: 'Peugeot',
        model: '208'
      })
    })

    it('should not include values which are not present in any state even if declared in the structure', () => {
      const extendedState = _of({
        brand: 'Peugeot'
      }).pipe(
        FeatureStoreFormBuilder.extendState<PartialDeep<Car>>(
          {
            brand: 'Renault'
          },
          {
            brand: {
              type: 'string',
              validators: ValidatorName.Required
            },
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
            }
          }
        )
      )

      expect(extendedState).not.toContainKey('engine')
    })

    it('should not extend values which are not present in the structure', () => {
      const extendedState = _of({
        brand: 'Peugeot',
        model: '208'
      }).pipe(
        FeatureStoreFormBuilder.extendState<PartialDeep<Car>>(
          {
            brand: 'Renault',
            engine: {
              cylinders: 1598,
              name: '1.6 THP',
              power: 200,
              valves: []
            }
          },
          {
            brand: {
              type: 'string',
              validators: ValidatorName.Required
            },
            model: 'string'
          }
        )
      )

      expect(extendedState).toEqual({
        brand: 'Peugeot',
        model: '208'
      })
    })

    it('should extend missing control values of sub-groups from given state', () => {
      const extendedState = _of({
        brand: 'Peugeot',
        engine: {
          name: '1.6 THP'
        }
      }).pipe(
        FeatureStoreFormBuilder.extendState<PartialDeep<Car>>(
          {
            brand: 'Renault',
            engine: {
              cylinders: 1598,
              name: '0.9 THP',
              power: 200,
              valves: []
            }
          },
          {
            brand: {
              type: 'string',
              validators: ValidatorName.Required
            },
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
            }
          }
        )
      )

      expect(extendedState).toEqual({
        brand: 'Peugeot',
        engine: {
          name: '1.6 THP',
          cylinders: 1598,
          power: 200,
          valves: []
        }
      })
    })

    it('should not extend simple array values from given state', () => {
      const extendedState = _of({
        brand: 'Peugeot',
        engine: {
          valves: [1]
        }
      }).pipe(
        FeatureStoreFormBuilder.extendState<PartialDeep<Car>>(
          {
            brand: 'Renault',
            engine: {
              valves: [2, 3]
            }
          },
          {
            brand: {
              type: 'string',
              validators: ValidatorName.Required
            },
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
            }
          }
        )
      )

      expect(extendedState).toEqual({
        brand: 'Peugeot',
        engine: {
          valves: [1]
        }
      })
    })

    it('should not extend complex array values from given state', () => {
      const extendedState = _of({
        brand: 'Peugeot',
        wheels: [
          {
            width: 255,
            height: 40,
            diameter: 13
          }
        ]
      }).pipe(
        FeatureStoreFormBuilder.extendState<PartialDeep<Car>>(
          {
            brand: 'Renault',
            wheels: [
              {
                width: 255,
                height: 45,
                diameter: 15
              },
              {
                width: 255,
                height: 45,
                diameter: 15
              }
            ]
          },
          {
            brand: {
              type: 'string',
              validators: ValidatorName.Required
            },
            wheels: {
              type: 'array',
              items: {
                width: 'number',
                height: 'number',
                diameter: 'number'
              }
            }
          }
        )
      )

      expect(extendedState).toEqual({
        brand: 'Peugeot',
        wheels: [
          {
            width: 255,
            height: 40,
            diameter: 13
          }
        ]
      })
    })
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
