import { Structure } from '@mondosha1/feature-store-kit'
import { deepFreeze } from '@mondosha1/object'
import { FeatureStoreEffectHelper } from './feature-store-effects.helper'
import {
  brandWrapperFSKey,
  creativeListFSKey,
  creativeListOnBrandSegments,
  creativeListSegments,
  creativeListWithEditOutletSegments,
  inventoriesSegments,
  inventoriesSegmentsWithDialogOnCreativeListSegments
} from './feature-store-effects.helper.mocks'

describe('Feature store helpers', () => {
  describe('generateRouteHash', () => {
    it("should return a null hash if doesn't match featureStoreKey (matchesFeatureStoreKey)", () => {
      expect(FeatureStoreEffectHelper.generateRouteHash(creativeListFSKey, creativeListSegments)).not.toBeNull()
      expect(FeatureStoreEffectHelper.generateRouteHash('toto', [])).toBeNull()
      expect(FeatureStoreEffectHelper.generateRouteHash(creativeListFSKey, [])).toBeNull()
      expect(FeatureStoreEffectHelper.generateRouteHash(creativeListFSKey, inventoriesSegments)).toBeNull()
    })

    it('should return a hash prefixed with the outlet name where we find the FSKey', () => {
      expect(FeatureStoreEffectHelper.generateRouteHash(creativeListFSKey, creativeListSegments)).toBe(
        'primary/creatives'
      )
      expect(FeatureStoreEffectHelper.generateRouteHash(creativeListFSKey, creativeListWithEditOutletSegments)).toBe(
        'primary/creatives'
      )
      expect(FeatureStoreEffectHelper.generateRouteHash(creativeListFSKey, creativeListOnBrandSegments)).toBe(
        'primary/settings/brands/302/creatives'
      )
      expect(
        FeatureStoreEffectHelper.generateRouteHash(
          creativeListFSKey,
          inventoriesSegmentsWithDialogOnCreativeListSegments
        )
      ).toBe('dialog1/creatives')
      expect(FeatureStoreEffectHelper.generateRouteHash(brandWrapperFSKey, creativeListOnBrandSegments)).toBe(
        'primary/settings/brands/302'
      )
    })
  })

  describe('matchesFeatureStoreKey', () => {
    it('should return true if a segment has feature store key inside data', () => {
      expect(FeatureStoreEffectHelper.matchesFeatureStoreKey(creativeListFSKey, creativeListSegments)).toBe(true)
    })

    it("should return false if a segment don't have feature store key inside data", () => {
      expect(FeatureStoreEffectHelper.matchesFeatureStoreKey(creativeListFSKey, inventoriesSegments)).toBe(false)
    })

    it("should return false if a segment don't match feature store key inside data", () => {
      expect(FeatureStoreEffectHelper.matchesFeatureStoreKey('', creativeListSegments)).toBe(false)
      expect(FeatureStoreEffectHelper.matchesFeatureStoreKey('noWay!', creativeListSegments)).toBe(false)
    })
  })

  describe('getAllParameters', () => {})

  describe('getParametersByFeatureStoreKey', () => {
    expect(
      FeatureStoreEffectHelper.getParametersByFeatureStoreKey(creativeListFSKey, creativeListOnBrandSegments)
    ).toStrictEqual({
      brandId: '302',
      search: 'a',
      status: '0'
    })
  })

  describe('formatParams', () => {
    const referenceState = {
      brandId: null,
      search: null
    }
    const structure = deepFreeze<Structure<{ brandId: number; search: string; filters: string[] }>>({
      brandId: 'number',
      search: 'string',
      filters: {
        type: 'array',
        items: 'string'
      }
    })

    it('should update existing params with new params and format them', () => {
      const newParams = { brandId: 2, search: 'updated text' }
      const currentState = { brandId: null, search: 'text from state' }
      const existingParams = { brandId: 2, search: 'some text' }
      const formattedParams = FeatureStoreEffectHelper.formatParams(
        referenceState,
        structure,
        null,
        newParams,
        currentState,
        existingParams
      )
      expect(formattedParams).toEqual({ brandId: '2', search: 'updated text' })
    })

    it('should return null if there is no param to update', () => {
      const newParams = { brandId: 2, search: 'some text' }
      const formattedParams = FeatureStoreEffectHelper.formatParams(
        { brandId: 2, search: 'some text' },
        structure,
        null,
        newParams,
        { brandId: 2, search: 'some text' },
        {}
      )
      expect(formattedParams).toBeNull()
    })

    it('should inherit from params in state if absent from both new and existing params', () => {
      const newParams = { brandId: 2, search: 'some text' }
      const currentState = { brandId: 2, search: '', filters: ['filter1', 'filter2'] }
      const existingParams = { brandId: 2, search: 'some text' }
      const formattedParams = FeatureStoreEffectHelper.formatParams(
        referenceState,
        structure,
        null,
        newParams,
        currentState,
        existingParams
      )
      expect(formattedParams).toEqual({
        brandId: '2',
        filters: 'filter1,filter2',
        search: 'some text'
      })
    })

    it('should ignore params if structurePathsForParams are given and param is not present inside', () => {
      const newParams = { brandId: 2, search: 'some text' }
      const currentState = { search: '', filters: ['filter1', 'filter2'] }
      const existingParams = { search: 'some text' }
      const structurePathsForParams = ['filters', 'search']
      const formattedParams = FeatureStoreEffectHelper.formatParams(
        referenceState,
        structure,
        structurePathsForParams,
        newParams,
        currentState,
        existingParams
      )
      expect(formattedParams).toEqual({
        filters: 'filter1,filter2',
        search: 'some text'
      })
    })

    it('should ignore params which have the same value as both in the reference state and in the current state', () => {
      let formattedParams

      formattedParams = FeatureStoreEffectHelper.formatParams(
        { brandId: 1, search: null },
        structure,
        null,
        { brandId: 2, search: 'updated text' },
        { brandId: 2, search: 'some text' },
        {}
      )
      expect(formattedParams).toEqual({
        brandId: '2',
        search: 'updated text'
      })

      formattedParams = FeatureStoreEffectHelper.formatParams(
        { brandId: 2, search: null },
        structure,
        null,
        { brandId: 2, search: 'updated text' },
        { brandId: 1, search: 'some text' },
        {}
      )
      expect(formattedParams).toEqual({
        brandId: '2',
        search: 'updated text'
      })

      formattedParams = FeatureStoreEffectHelper.formatParams(
        { brandId: 2, search: null },
        structure,
        null,
        { brandId: 2, search: 'updated text' },
        { brandId: 2, search: 'some text' },
        {}
      )
      expect(formattedParams).toEqual({
        search: 'updated text'
      })
    })

    it('should ignore params which are not whitelisted in structurePathsForParams and not remove them from existing params', () => {
      const currentState = { brandId: 1, search: 'some text' }
      let formattedParams

      formattedParams = FeatureStoreEffectHelper.formatParams(
        referenceState,
        structure,
        ['search'],
        { brandId: 1, search: 'updated text' },
        currentState,
        currentState
      )
      expect(formattedParams).toEqual({
        brandId: '1',
        search: 'updated text'
      })

      formattedParams = FeatureStoreEffectHelper.formatParams(
        referenceState,
        structure,
        ['search'],
        { brandId: 2, search: 'updated text' },
        currentState,
        currentState
      )
      expect(formattedParams).toEqual({
        brandId: '1',
        search: 'updated text'
      })
    })
  })

  describe('createOutletsPath', () => {})

  describe('createPath', () => {})
})
