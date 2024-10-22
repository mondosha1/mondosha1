import { fakeAsync, flush, TestBed } from '@angular/core/testing'
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms'
import { of as _of } from '@mondosha1/core'
import { Nullable } from '@mondosha1/nullable'
import { get, PartialDeep } from '@mondosha1/object'
import { firstValue } from '@mondosha1/observable'
import { Store } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { getOr, omit, values } from 'lodash/fp'
import { Observable, of, Subject } from 'rxjs'
import { FeatureStoreFormBuilder, FeatureStoreFormFactory } from './feature-store.form'
import { formula } from './feature-store.formula'
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
  let destroy$ = new Subject()
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
    wheels: [],
    options: {
      window: {
        isManual: true,
        centralization: false
      }
    }
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
    options: {
      window: {
        isManual: 'boolean',
        centralization: {
          type: 'boolean',
          disabled: formula`options.window.isManual == true`
        }
      }
    },
    wheels: {
      type: 'array',
      items: {
        width: 'number',
        height: {
          type: 'number',
          validators: {
            formula: formula`AND(ISEMPTY(wheels[$index].width), NOT(ISEMPTY(wheels[$index].height)))`,
            message: 'You must fill the width first'
          }
        },
        diameter: {
          type: 'number',
          disabled: formula`ISEMPTY(model)`,
          validators: {
            name: ValidatorName.Required,
            condition: formula`AND(NOT(ISEMPTY(wheels[$index].width)), NOT(ISEMPTY(wheels[$index].height)))`
          }
        },
        bolts: {
          disabled: formula`ISEMPTY(model)`,
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

  describe('indexKeys', () => {
    it('should be created', () => {
      expect(FeatureStoreFormBuilder.indexKeys)
        .toBeArray()
        .toSatisfyAll(item => {
          expect(item)
            .toStartWith('$index')
            .toMatch(/^\$index(_[0-9]*)?$/)
            .not.toBe('$index_0')
          return true
        })
    })
  })

  describe('create', () => {
    it('should create a form group from the whole structure if no structure paths if given', () => {
      const formGroup = featureStoreFormBuilder.create({ takeUntil$: destroy$ })
      expect(formGroup).toBeInstanceOf(FormGroup)
      expect(formGroup.controls)
        .toBeObject()
        .toContainAllKeys(['brand', 'model', 'manualTransmission', 'engine', 'wheels', 'options'])
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
        .not.toContainKeys(['brand', 'wheels', 'options'])
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

      expect(formGroup.get('options.window.centralization').disabled).toBe(true)

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
        options: {
          window: {
            isManual: true
          }
        },
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
          } as Engine,
          options: {
            window: {
              isManual: true,
              centralization: false
            }
          } as Options
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
        options: {
          window: {
            isManual: true
          }
        },
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
        options: {
          window: {
            isManual: true
          }
        },
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

  describe('withIndex$', () => {
    it('should define an $index property if there were no index declared before', async () => {
      const stateWithIndex = of(carState).pipe(featureStoreFormBuilder.withIndex$(1))
      expect(await firstValue(stateWithIndex)).toEqual({ ...carState, $index: 1 })
    })

    it('should define an consequent $index if some are already defined property if there were no index declared before', async () => {
      const stateWithIndex = of(carState).pipe(
        featureStoreFormBuilder.withIndex$(2),
        featureStoreFormBuilder.withIndex$(3),
        featureStoreFormBuilder.withIndex$(1)
      )
      expect(await firstValue(stateWithIndex)).toEqual({ ...carState, $index: 2, $index_1: 3, $index_2: 1 })
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

  describe('disabler', () => {
    it('should update the form disabled status on state changes', async () => {
      const formGroup = featureStoreFormBuilder.create({ takeUntil$: destroy$ })
      expect(formGroup.get('options.window.centralization').disabled).toBe(true)
      store.setState({
        [CAR_FEATURE_STORE_KEY]: {
          ...carState,
          options: {
            window: {
              isManual: false
            }
          } as Options,
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
        options: {
          window: {
            isManual: false,
            centralization: false
          }
        },
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
      expect(formGroup.get('options.window.centralization').disabled).toBe(false)

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
                  length: 1,
                  diameter: 1
                }
              ]
            },
            {
              width: 265,
              height: 42,
              diameter: 14,
              bolts: []
            }
          ],
          model: null
        }
      })

      store.refreshState()
      expect(formGroup.get('wheels').enabled).toBeTruthy()
      expect(formGroup.get('wheels.0.diameter').disabled).toBeTruthy()
      expect(formGroup.get('wheels.1.diameter').disabled).toBeTruthy()
      expect(formGroup.get('wheels.0.bolts.0').disabled).toBeTruthy()
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
              formula: formula`model != "Clio"`,
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
                formula: formula`OR(AND(brand == "Peugeot", model == "Clio"), AND(brand == "Renault", model == "206"))`,
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
                    condition: formula`brand == "Peugeot"`
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
          options: {
            window: {
              isManual: true
            }
          },
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

      it('should set the created form array as parent of child controls', () => {
        const formArray = featureStoreFormBuilder.createControl(carStructure.wheels) as FormArray
        expect(formArray.controls).not.toBeEmpty()
        expect(formArray.controls).toSatisfyAll(control => {
          expect(control.parent).toBe(formArray)
          return true
        })
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

      it('should set the created form group as parent of child controls', () => {
        const formGroup = featureStoreFormBuilder.createControl(carStructure.engine, 'engine') as FormGroup
        expect(formGroup.controls).not.toBeEmpty()
        expect(values(formGroup.controls)).toSatisfyAll(control => {
          expect(control.parent).toBe(formGroup)
          return true
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
          .toContainAllKeys(['brand', 'model', 'manualTransmission', 'engine', 'wheels', 'options'])
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

    it('should allow validators on neighbor properties in a same form array item', fakeAsync(() => {
      const formGroup = featureStoreFormBuilder.create({ takeUntil$: destroy$ })

      store.setState({
        [CAR_FEATURE_STORE_KEY]: {
          ...carState,
          wheels: [
            {
              width: null,
              height: 100
            }
          ] as Wheel[]
        }
      })

      store.refreshState()

      flush()

      expect(formGroup.get('wheels').valid).toBe(false)
      expect(formGroup.get('wheels.0').valid).toBe(false)
      expect(formGroup.get('wheels.0.width').valid).toBe(true)
      expect(formGroup.get('wheels.0.height').valid).toBe(false)
      expect(formGroup.get('wheels.0.height').errors).toEqual({
        featureStoreFormula: {
          errorMessage: 'You must fill the width first'
        }
      })

      store.setState({
        [CAR_FEATURE_STORE_KEY]: {
          ...carState,
          wheels: [
            {
              width: 100,
              height: 100
            }
          ] as Wheel[]
        }
      })

      store.refreshState()

      flush()

      expect(formGroup.get('wheels.0.width').valid).toBe(true)
      expect(formGroup.get('wheels.0.height').valid).toBe(true)
      expect(formGroup.get('wheels.0.height').errors).toBeNull()

      destroy$.next()
    }))

    it('should allow conditions on neighbor properties in a same form array item', fakeAsync(() => {
      const formGroup = featureStoreFormBuilder.create({ takeUntil$: destroy$ })

      store.setState({
        [CAR_FEATURE_STORE_KEY]: {
          ...carState,
          wheels: [
            {
              width: 10,
              height: 10,
              diameter: null
            }
          ] as Wheel[]
        }
      })

      store.refreshState()

      flush()

      expect(formGroup.get('wheels').valid).toBe(false)
      expect(formGroup.get('wheels.0').valid).toBe(false)
      expect(formGroup.get('wheels.0.width').valid).toBe(true)
      expect(formGroup.get('wheels.0.height').valid).toBe(true)
      expect(formGroup.get('wheels.0.diameter').valid).toBe(false)
      expect(formGroup.get('wheels.0.diameter').errors).toEqual({ required: true })

      store.setState({
        [CAR_FEATURE_STORE_KEY]: {
          ...carState,
          wheels: [
            {
              width: 10,
              height: 10,
              diameter: 10
            }
          ] as Wheel[]
        }
      })

      store.refreshState()

      flush()

      expect(formGroup.get('wheels.0.width').valid).toBe(true)
      expect(formGroup.get('wheels.0.height').valid).toBe(true)
      expect(formGroup.get('wheels.0.diameter').valid).toBe(true)
      expect(formGroup.get('wheels.0.diameter').errors).toBeNull()

      destroy$.next()
    }))
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

    it('should extend missing control values if a complex field type is given without validators', () => {
      const extendedState = _of({
        brand: 'Renault'
      }).pipe(
        FeatureStoreFormBuilder.extendState<Partial<Car>>(
          {
            brand: 'Renault'
          },
          {
            brand: {
              type: 'string'
            },
            model: 'string'
          }
        )
      )

      expect(extendedState).toEqual({
        brand: 'Renault'
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

interface Options {
  window: {
    isManual: boolean
    centralization: boolean
  }
}

interface Car {
  brand: string
  model: string
  manualTransmission: boolean
  engine: Partial<Engine>
  wheels: Wheel[]
  options: Options
}
