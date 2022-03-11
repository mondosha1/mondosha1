import { of } from '@mondosha1/core'
import { get } from '@mondosha1/object'
import { FeatureStoreStructure, Structure, ValidatorName } from './feature-store.structure'

describe('Feature store structure', () => {
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

  describe('extractType', () => {
    it('should extract the type of a simple field available at root', () => {
      expect(FeatureStoreStructure.extractType(carStructure, ['model'])).toBe('string')
      expect(FeatureStoreStructure.extractType(carStructure, ['manualTransmission'])).toBe('boolean')
    })

    it('should extract the type of a complex field available at root', () => {
      expect(FeatureStoreStructure.extractType(carStructure, ['brand'])).toBe('string')
    })

    it('should extract the type of a simple field embedded in a form group', () => {
      expect(FeatureStoreStructure.extractType(carStructure, ['engine', 'power'])).toBe('number')
    })

    it('should extract the type of a complex field embedded in a form group', () => {
      expect(FeatureStoreStructure.extractType(carStructure, ['engine', 'name'])).toBe('string')
    })

    it('should extract the type of a field array with simple items', () => {
      expect(FeatureStoreStructure.extractType(carStructure, ['engine', 'valves'])).toBe('number[]')
    })

    it('should extract the type of a simple item in a field array', () => {
      expect(FeatureStoreStructure.extractType(carStructure, ['wheels', 0, 'width'])).toBe('number')
    })
  })

  describe('getAtStatePath', () => {
    it('should get the field type at state path of a simple field available at root', () => {
      expect(FeatureStoreStructure.getAtStatePath(carStructure, ['model'])).toBe(carStructure.model)
      expect(FeatureStoreStructure.getAtStatePath(carStructure, ['manualTransmission'])).toBe(
        carStructure.manualTransmission
      )
    })

    it('should get the field at state path of a complex field available at root', () => {
      expect(FeatureStoreStructure.getAtStatePath(carStructure, ['brand'])).toBe(carStructure.brand)
    })

    it('should get the field type at state path of a simple field embedded in a form group', () => {
      expect(FeatureStoreStructure.getAtStatePath(carStructure, ['engine', 'power'])).toBe(
        of(carStructure).pipe(get('engine.power'))
      )
    })

    it('should get the field at state path of a complex field embedded in a form group', () => {
      expect(FeatureStoreStructure.getAtStatePath(carStructure, ['engine', 'name'])).toBe(
        of(carStructure).pipe(get('engine.name'))
      )
    })

    it('should get the field at state path of a field array with simple items', () => {
      expect(FeatureStoreStructure.getAtStatePath(carStructure, ['engine', 'valves'])).toBe(
        of(carStructure).pipe(get('engine.valves'))
      )
    })

    it('should get the field at state path of a simple item in a field array', () => {
      expect(FeatureStoreStructure.getAtStatePath(carStructure, ['wheels', 0, 'width'])).toBe(
        of(carStructure).pipe(get('wheels.items.width'))
      )
      expect(FeatureStoreStructure.getAtStatePath(carStructure, ['wheels', 1, 'width'])).toBe(
        of(carStructure).pipe(get('wheels.items.width'))
      )
    })
  })

  describe('isComplexArrayField', () => {
    it('should return false if not a valid field', () => {
      expect(
        FeatureStoreStructure.isComplexArrayField({
          type: 'array',
          items: {
            diameter: 'number'
          },
          notAPermittedKey: true
        })
      ).toBe(false)
    })

    it('should return false if not an array field', () => {
      expect(
        FeatureStoreStructure.isComplexArrayField({
          type: 'number',
          items: {
            diameter: 'number'
          }
        })
      ).toBe(false)
    })

    it('should return false if a valid array field but with simple items', () => {
      expect(
        FeatureStoreStructure.isComplexArrayField({
          type: 'array',
          items: 'number'
        })
      ).toBe(false)
    })

    it('should return true if a valid array field with complex items', () => {
      expect(
        FeatureStoreStructure.isComplexArrayField({
          type: 'array',
          items: {
            diameter: 'number'
          }
        })
      ).toBe(true)
    })
  })

  describe('isField', () => {
    it('should return false if does not contain only valid keys', () => {
      expect(FeatureStoreStructure.isField({ type: 'string' })).toBe(true)
      expect(FeatureStoreStructure.isField({ type: 'string', notAPermittedKey: true })).toBe(false)
    })

    it('should return false if does not contain the "type" key', () => {
      expect(FeatureStoreStructure.isField({})).toBe(false)
      expect(FeatureStoreStructure.isField({ items: 'number' })).toBe(false)
      expect(FeatureStoreStructure.isField({ items: 'number', validators: [] })).toBe(false)
      expect(FeatureStoreStructure.isField({ type: 'string' })).toBe(true)
    })

    it('should return false if not an object nor a plain object', () => {
      expect(FeatureStoreStructure.isField('')).toBe(false)
      expect(FeatureStoreStructure.isField(1)).toBe(false)
      expect(FeatureStoreStructure.isField(undefined)).toBe(false)
      expect(FeatureStoreStructure.isField(null)).toBe(false)

      class A {}

      expect(FeatureStoreStructure.isField(new A())).toBe(false)
    })
  })

  describe('isFieldGroup', () => {
    it('should return false if not an object nor a plain object', () => {
      expect(FeatureStoreStructure.isFieldGroup('')).toBe(false)
      expect(FeatureStoreStructure.isFieldGroup(1)).toBe(false)
      expect(FeatureStoreStructure.isFieldGroup(undefined)).toBe(false)
      expect(FeatureStoreStructure.isFieldGroup(null)).toBe(false)

      class A {}

      expect(FeatureStoreStructure.isFieldGroup(new A())).toBe(false)
    })

    it('should return false if does not contain any field or type', () => {
      expect(FeatureStoreStructure.isFieldGroup({})).toBe(false)

      const validFieldType = 'number'
      expect(FeatureStoreStructure.isSimpleFieldType(validFieldType)).toBe(true)
      expect(
        FeatureStoreStructure.isFieldGroup({
          fieldName: validFieldType
        })
      ).toBe(true)

      expect(
        FeatureStoreStructure.isFieldGroup({
          fieldName: {
            notAValidField: true
          }
        })
      ).toBe(false)

      const validField = {
        type: 'number'
      }
      expect(FeatureStoreStructure.isField(validField)).toBe(true)
      expect(
        FeatureStoreStructure.isFieldGroup({
          fieldName: validField
        })
      ).toBe(true)
    })
  })

  describe('isFieldType', () => {
    it('should return true if a valid simple field type', () => {
      expect(FeatureStoreStructure.isSimpleFieldType('string')).toBe(true)
      expect(FeatureStoreStructure.isSimpleFieldType('number')).toBe(true)
      expect(FeatureStoreStructure.isSimpleFieldType('boolean')).toBe(true)
      expect(FeatureStoreStructure.isSimpleFieldType('object')).toBe(true)
    })

    it('should return false if not a valid simple field type', () => {
      expect(FeatureStoreStructure.isSimpleFieldType('anything else')).toBe(false)
      expect(FeatureStoreStructure.isSimpleFieldType(1)).toBe(false)
      expect(FeatureStoreStructure.isSimpleFieldType(null)).toBe(false)
      expect(FeatureStoreStructure.isSimpleFieldType({})).toBe(false)
      expect(FeatureStoreStructure.isSimpleFieldType(undefined)).toBe(false)
    })
  })

  describe('isStructure', () => {
    it('should return false if not an object nor a plain object', () => {
      expect(FeatureStoreStructure.isStructure('')).toBe(false)
      expect(FeatureStoreStructure.isStructure(1)).toBe(false)
      expect(FeatureStoreStructure.isStructure(undefined)).toBe(false)
      expect(FeatureStoreStructure.isStructure(null)).toBe(false)

      class A {}

      expect(FeatureStoreStructure.isStructure(new A())).toBe(false)
    })

    it('should return false if does not contain any field group, field or type', () => {
      expect(FeatureStoreStructure.isStructure({})).toBe(false)

      const validFieldType = 'number'
      expect(FeatureStoreStructure.isSimpleFieldType(validFieldType)).toBe(true)
      expect(
        FeatureStoreStructure.isStructure({
          fieldName: validFieldType
        })
      ).toBe(true)

      expect(
        FeatureStoreStructure.isStructure({
          fieldName: {
            notAValidField: true
          }
        })
      ).toBe(false)

      const validField = {
        type: 'number'
      }
      expect(FeatureStoreStructure.isField(validField)).toBe(true)
      expect(
        FeatureStoreStructure.isStructure({
          fieldName: validField
        })
      ).toBe(true)

      expect(
        FeatureStoreStructure.isStructure({
          fieldGroupName: {
            fieldName: {
              notAValidField: true
            }
          }
        })
      ).toBe(false)

      const validFieldGroup = {
        fieldName: {
          type: 'number'
        }
      }
      expect(FeatureStoreStructure.isFieldGroup(validFieldGroup)).toBe(true)
      expect(
        FeatureStoreStructure.isStructure({
          fieldGroupName: validFieldGroup
        })
      ).toBe(true)
    })
  })

  describe('parseParams', () => {
    it('should parse null represented as string without regarding the type in the structure', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: 'null'
          },
          {}
        )
      )
        .toBeObject()
        .toBeEmpty()
    })

    it('should parse undefined represented as string without regarding the type in the structure', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: 'undefined'
          },
          {}
        )
      ).toEqual({ fieldName: undefined })
    })

    it('should parse string values regarding the structure', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: 'helloworld'
          },
          {
            fieldName: 'string'
          }
        )
      ).toEqual({ fieldName: 'helloworld' })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: 'helloworld'
          },
          {
            fieldName: {
              type: 'string'
            }
          }
        )
      ).toEqual({ fieldName: 'helloworld' })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: '123'
          },
          {
            fieldName: 'string'
          }
        )
      ).toEqual({ fieldName: '123' })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: 'true'
          },
          {
            fieldName: 'string'
          }
        )
      ).toEqual({ fieldName: 'true' })
    })

    it('should parse number values regarding the structure', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: '123'
          },
          {
            fieldName: 'number'
          }
        )
      ).toEqual({ fieldName: 123 })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: '123.45'
          },
          {
            fieldName: 'number'
          }
        )
      ).toEqual({ fieldName: 123.45 })
    })

    it('should set params to null if defined as number but could not be parsed', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: 'helloworld'
          },
          {
            fieldName: {
              type: 'number'
            }
          }
        )
      ).toEqual({ fieldName: null })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: 'true'
          },
          {
            fieldName: 'number'
          }
        )
      ).toEqual({ fieldName: null })
    })

    it('should parse boolean values regarding the structure', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: 'true'
          },
          {
            fieldName: 'boolean'
          }
        )
      ).toEqual({ fieldName: true })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: '1'
          },
          {
            fieldName: 'boolean'
          }
        )
      ).toEqual({ fieldName: true })
    })

    it('should parse object values regarding the structure', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: '1564735624'
          },
          {
            fieldName: 'date'
          }
        )
      ).toEqual({ fieldName: 1564735624 })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: '1564735624000'
          },
          {
            fieldName: 'date'
          }
        )
      ).toEqual({ fieldName: 1564735624000 })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: '2019-08-02T12:30:00'
          },
          {
            fieldName: 'date'
          }
        )
      ).toEqual({ fieldName: '2019-08-02T12:30:00' })
    })

    it('should parse object values regarding the structure', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: '{"helloworld":666}'
          },
          {
            fieldName: 'object'
          }
        )
      ).toEqual({ fieldName: { helloworld: 666 } })
    })

    it('should set params to null if defined as boolean but could not be parsed', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: 'notABooleanReprensentedAsAString'
          },
          {
            fieldName: {
              type: 'boolean'
            }
          }
        )
      ).toEqual({ fieldName: null })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: '2'
          },
          {
            fieldName: 'boolean'
          }
        )
      ).toEqual({ fieldName: null })
    })

    it('should parse arrays of string regarding the structure', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: 'hello,world'
          },
          {
            fieldName: {
              type: 'array',
              items: 'string'
            }
          }
        )
      ).toEqual({ fieldName: ['hello', 'world'] })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: 'hello,world'
          },
          {
            fieldName: {
              type: 'array',
              items: 'string'
            }
          }
        )
      ).toEqual({ fieldName: ['hello', 'world'] })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: '123,456'
          },
          {
            fieldName: {
              type: 'array',
              items: 'string'
            }
          }
        )
      ).toEqual({ fieldName: ['123', '456'] })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: 'true,false'
          },
          {
            fieldName: {
              type: 'array',
              items: 'string'
            }
          }
        )
      ).toEqual({ fieldName: ['true', 'false'] })
    })

    it('should parse arrays of number regarding the structure', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: '123,456'
          },
          {
            fieldName: {
              type: 'array',
              items: 'number'
            }
          }
        )
      ).toEqual({ fieldName: [123, 456] })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: '123.45,7.89'
          },
          {
            fieldName: {
              type: 'array',
              items: 'number'
            }
          }
        )
      ).toEqual({ fieldName: [123.45, 7.89] })
    })

    it('should parse arrays of boolean regarding the structure', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: 'true,false'
          },
          {
            fieldName: {
              type: 'array',
              items: 'boolean'
            }
          }
        )
      ).toEqual({ fieldName: [true, false] })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: '0,1'
          },
          {
            fieldName: {
              type: 'array',
              items: 'boolean'
            }
          }
        )
      ).toEqual({ fieldName: [false, true] })
    })

    it('should parse empty arrays regarding the structure', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: ''
          },
          {
            fieldName: {
              type: 'array',
              items: 'string'
            }
          }
        )
      ).toEqual({ fieldName: [] })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: ''
          },
          {
            fieldName: {
              type: 'array',
              items: 'number'
            }
          }
        )
      ).toEqual({ fieldName: [] })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: ''
          },
          {
            fieldName: {
              type: 'array',
              items: 'boolean'
            }
          }
        )
      ).toEqual({ fieldName: [] })

      expect(
        FeatureStoreStructure.parseParams(
          {
            fieldName: ''
          },
          {
            fieldName: {
              type: 'array',
              items: 'object'
            }
          }
        )
      ).toEqual({ fieldName: [] })
    })

    it('should parse params with complex paths regarding the structure', () => {
      expect(
        FeatureStoreStructure.parseParams(
          {
            'fieldGroupName.fieldName': 'helloworld'
          },
          {
            fieldGroupName: {
              fieldName: 'string'
            }
          }
        )
      ).toEqual({
        fieldGroupName: {
          fieldName: 'helloworld'
        }
      })

      expect(
        FeatureStoreStructure.parseParams(
          {
            'fieldGroupName.fieldName': '123'
          },
          {
            fieldGroupName: {
              fieldName: 'number'
            }
          }
        )
      ).toEqual({
        fieldGroupName: {
          fieldName: 123
        }
      })

      expect(
        FeatureStoreStructure.parseParams(
          {
            'fieldGroupName.fieldName': 'true'
          },
          {
            fieldGroupName: {
              fieldName: 'boolean'
            }
          }
        )
      ).toEqual({
        fieldGroupName: {
          fieldName: true
        }
      })

      expect(
        FeatureStoreStructure.parseParams(
          {
            'fieldGroupName.fieldName': '0'
          },
          {
            fieldGroupName: {
              fieldName: 'boolean'
            }
          }
        )
      ).toEqual({
        fieldGroupName: {
          fieldName: false
        }
      })

      expect(
        FeatureStoreStructure.parseParams(
          {
            'fieldGroupName.fieldName': 'hello,world'
          },
          {
            fieldGroupName: {
              fieldName: {
                type: 'array',
                items: 'string'
              }
            }
          }
        )
      ).toEqual({
        fieldGroupName: {
          fieldName: ['hello', 'world']
        }
      })

      expect(
        FeatureStoreStructure.parseParams(
          {
            'fieldGroupName.fieldName': '1,2,3'
          },
          {
            fieldGroupName: {
              fieldName: {
                type: 'array',
                items: 'number'
              }
            }
          }
        )
      ).toEqual({
        fieldGroupName: {
          fieldName: [1, 2, 3]
        }
      })

      expect(
        FeatureStoreStructure.parseParams(
          {
            'fieldGroupName.fieldName': 'true,false,true'
          },
          {
            fieldGroupName: {
              fieldName: {
                type: 'array',
                items: 'boolean'
              }
            }
          }
        )
      ).toEqual({
        fieldGroupName: {
          fieldName: [true, false, true]
        }
      })

      expect(
        FeatureStoreStructure.parseParams(
          {
            'fieldGroupName.fieldName': '0,1,0'
          },
          {
            fieldGroupName: {
              fieldName: {
                type: 'array',
                items: 'boolean'
              }
            }
          }
        )
      ).toEqual({
        fieldGroupName: {
          fieldName: [false, true, false]
        }
      })
    })

    it('should return an empty object if no params given', () => {
      expect(FeatureStoreStructure.parseParams({}, {})).toEqual({})
    })
  })

  describe('formatParams', () => {
    it('should format simple fields', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            brand: 'Peugeot'
          },
          {
            brand: 'string'
          }
        )
      ).toEqual({ brand: 'Peugeot' })
    })

    it('should format field groups', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            brand: 'Peugeot',
            engine: {
              name: '1.6 THP'
            }
          },
          {
            brand: 'string',
            engine: {
              name: 'string'
            }
          }
        )
      ).toEqual({
        brand: 'Peugeot',
        'engine.name': '1.6 THP'
      })
    })

    it('should format string values regarding the structure', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: 'helloworld'
          },
          {
            fieldName: 'string'
          }
        )
      ).toEqual({ fieldName: 'helloworld' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: 'helloworld'
          },
          {
            fieldName: {
              type: 'string'
            }
          }
        )
      ).toEqual({ fieldName: 'helloworld' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: '123'
          },
          {
            fieldName: 'string'
          }
        )
      ).toEqual({ fieldName: '123' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: 'true'
          },
          {
            fieldName: 'string'
          }
        )
      ).toEqual({ fieldName: 'true' })
    })

    it('should format number values regarding the structure', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: 123
          },
          {
            fieldName: 'number'
          }
        )
      ).toEqual({ fieldName: '123' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: 123.45
          },
          {
            fieldName: 'number'
          }
        )
      ).toEqual({ fieldName: '123.45' })
    })

    it('should set params to null if defined as number but could not be formated', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: 'helloworld'
          },
          {
            fieldName: {
              type: 'number'
            }
          }
        )
      ).toEqual({ fieldName: '' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: true
          },
          {
            fieldName: 'number'
          }
        )
      ).toEqual({ fieldName: '' })
    })

    it('should format boolean values regarding the structure', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: true
          },
          {
            fieldName: 'boolean'
          }
        )
      ).toEqual({ fieldName: 'true' })
    })

    it('should format the date values only for ISO formats', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: 1564735624
          },
          {
            fieldName: 'date'
          }
        )
      ).toEqual({ fieldName: '' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: 1564735624000
          },
          {
            fieldName: 'date'
          }
        )
      ).toEqual({ fieldName: '' })
    })

    it('should format date values regarding the structure', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: '2019-08-02T12:30:00'
          },
          {
            fieldName: 'date'
          }
        )
      ).toEqual({ fieldName: '2019-08-02T12:30:00' })
    })

    it('should format object values regarding the structure', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: { helloworld: 666 }
          },
          {
            fieldName: 'object'
          }
        )
      ).toEqual({ fieldName: '{"helloworld":666}' })
    })

    it('should set params to null if defined as boolean but could not be formatted', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: 'notABooleanReprensentedAsAString'
          },
          {
            fieldName: {
              type: 'boolean'
            }
          }
        )
      ).toEqual({ fieldName: '' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: '2'
          },
          {
            fieldName: 'boolean'
          }
        )
      ).toEqual({ fieldName: '' })
    })

    it('should format arrays of string regarding the structure', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: ['hello', 'world']
          },
          {
            fieldName: {
              type: 'array',
              items: 'string'
            }
          }
        )
      ).toEqual({ fieldName: 'hello,world' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: ['hello', 'world']
          },
          {
            fieldName: {
              type: 'array',
              items: 'string'
            }
          }
        )
      ).toEqual({ fieldName: 'hello,world' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: ['123', '456']
          },
          {
            fieldName: {
              type: 'array',
              items: 'string'
            }
          }
        )
      ).toEqual({ fieldName: '123,456' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: ['true', 'false']
          },
          {
            fieldName: {
              type: 'array',
              items: 'string'
            }
          }
        )
      ).toEqual({ fieldName: 'true,false' })
    })

    it('should format arrays of number regarding the structure', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: [123, 456]
          },
          {
            fieldName: {
              type: 'array',
              items: 'number'
            }
          }
        )
      ).toEqual({ fieldName: '123,456' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: [123.45, 7.89]
          },
          {
            fieldName: {
              type: 'array',
              items: 'number'
            }
          }
        )
      ).toEqual({ fieldName: '123.45,7.89' })
    })

    it('should format arrays of boolean regarding the structure', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: [true, false]
          },
          {
            fieldName: {
              type: 'array',
              items: 'boolean'
            }
          }
        )
      ).toEqual({ fieldName: 'true,false' })
    })

    it('should format empty arrays regarding the structure', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: []
          },
          {
            fieldName: {
              type: 'array',
              items: 'string'
            }
          }
        )
      ).toEqual({ fieldName: '' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: []
          },
          {
            fieldName: {
              type: 'array',
              items: 'number'
            }
          }
        )
      ).toEqual({ fieldName: '' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: []
          },
          {
            fieldName: {
              type: 'array',
              items: 'boolean'
            }
          }
        )
      ).toEqual({ fieldName: '' })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldName: []
          },
          {
            fieldName: {
              type: 'array',
              items: 'object'
            }
          }
        )
      ).toEqual({ fieldName: '' })
    })

    it('should format params with complex paths regarding the structure', () => {
      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldGroupName: {
              fieldName: 'helloworld'
            }
          },
          {
            fieldGroupName: {
              fieldName: 'string'
            }
          }
        )
      ).toEqual({
        'fieldGroupName.fieldName': 'helloworld'
      })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldGroupName: {
              fieldName: 123
            }
          },
          {
            fieldGroupName: {
              fieldName: 'number'
            }
          }
        )
      ).toEqual({
        'fieldGroupName.fieldName': '123'
      })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldGroupName: {
              fieldName: true
            }
          },
          {
            fieldGroupName: {
              fieldName: 'boolean'
            }
          }
        )
      ).toEqual({
        'fieldGroupName.fieldName': 'true'
      })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldGroupName: {
              fieldName: false
            }
          },
          {
            fieldGroupName: {
              fieldName: 'boolean'
            }
          }
        )
      ).toEqual({
        'fieldGroupName.fieldName': 'false'
      })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldGroupName: {
              fieldName: ['hello', 'world']
            }
          },
          {
            fieldGroupName: {
              fieldName: {
                type: 'array',
                items: 'string'
              }
            }
          }
        )
      ).toEqual({
        'fieldGroupName.fieldName': 'hello,world'
      })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldGroupName: {
              fieldName: [1, 2, 3]
            }
          },
          {
            fieldGroupName: {
              fieldName: {
                type: 'array',
                items: 'number'
              }
            }
          }
        )
      ).toEqual({
        'fieldGroupName.fieldName': '1,2,3'
      })

      expect(
        FeatureStoreStructure.formatParams(
          {
            fieldGroupName: {
              fieldName: [true, false, true]
            }
          },
          {
            fieldGroupName: {
              fieldName: {
                type: 'array',
                items: 'boolean'
              }
            }
          }
        )
      ).toEqual({
        'fieldGroupName.fieldName': 'true,false,true'
      })
    })

    it('should return an empty object if no params given', () => {
      expect(FeatureStoreStructure.formatParams({}, {})).toEqual({})
    })
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
