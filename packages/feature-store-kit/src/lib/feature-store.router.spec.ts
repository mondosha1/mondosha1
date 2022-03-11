import { deepFreeze } from '@mondosha1/object'
import {
  brandWrapperFSKey,
  creativeListFSKey,
  creativeListOnBrandSegments,
  creativeListSegments,
  creativeListWithEditOutletSegments,
  inventoriesSegments,
  inventoriesSegmentsWithDialogOnCreativeListSegments
} from './feature-store-effects.helper.mocks'
import { FeatureStoreRouter } from './feature-store.router'
import { Structure } from './feature-store.structure'

describe('Feature store router', () => {
  describe('generateRouteHash', () => {
    it("should return a null hash if doesn't match featureStoreKey (matchesFeatureStoreKey)", () => {
      expect(FeatureStoreRouter.generateRouteHash(creativeListFSKey, creativeListSegments)).not.toBeNull()
      expect(FeatureStoreRouter.generateRouteHash('toto', [])).toBeNull()
      expect(FeatureStoreRouter.generateRouteHash(creativeListFSKey, [])).toBeNull()
      expect(FeatureStoreRouter.generateRouteHash(creativeListFSKey, inventoriesSegments)).toBeNull()
    })

    it('should return a hash prefixed with the outlet name where we find the FSKey', () => {
      expect(FeatureStoreRouter.generateRouteHash(creativeListFSKey, creativeListSegments)).toBe('primary/creatives')
      expect(FeatureStoreRouter.generateRouteHash(creativeListFSKey, creativeListWithEditOutletSegments)).toBe(
        'primary/creatives'
      )
      expect(FeatureStoreRouter.generateRouteHash(creativeListFSKey, creativeListOnBrandSegments)).toBe(
        'primary/settings/brands/302/creatives'
      )
      expect(
        FeatureStoreRouter.generateRouteHash(creativeListFSKey, inventoriesSegmentsWithDialogOnCreativeListSegments)
      ).toBe('dialog1/creatives')
      expect(FeatureStoreRouter.generateRouteHash(brandWrapperFSKey, creativeListOnBrandSegments)).toBe(
        'primary/settings/brands/302'
      )
    })
  })

  describe('matchesFeatureStoreKey', () => {
    it('should return true if a segment has feature store key inside data', () => {
      expect(FeatureStoreRouter.matchesFeatureStoreKey(creativeListFSKey, creativeListSegments)).toBe(true)
    })

    it("should return false if a segment don't have feature store key inside data", () => {
      expect(FeatureStoreRouter.matchesFeatureStoreKey(creativeListFSKey, inventoriesSegments)).toBe(false)
    })

    it("should return false if a segment don't match feature store key inside data", () => {
      expect(FeatureStoreRouter.matchesFeatureStoreKey('', creativeListSegments)).toBe(false)
      expect(FeatureStoreRouter.matchesFeatureStoreKey('noWay!', creativeListSegments)).toBe(false)
    })
  })

  describe('getAllParameters', () => {})

  describe('getParametersByFeatureStoreKey', () => {
    expect(
      FeatureStoreRouter.getParametersByFeatureStoreKey(creativeListFSKey, creativeListOnBrandSegments)
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
      const formattedParams = FeatureStoreRouter.formatParams(
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
      const formattedParams = FeatureStoreRouter.formatParams(
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
      const formattedParams = FeatureStoreRouter.formatParams(
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
      const formattedParams = FeatureStoreRouter.formatParams(
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

      formattedParams = FeatureStoreRouter.formatParams(
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

      formattedParams = FeatureStoreRouter.formatParams(
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

      formattedParams = FeatureStoreRouter.formatParams(
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

      formattedParams = FeatureStoreRouter.formatParams(
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

      formattedParams = FeatureStoreRouter.formatParams(
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
