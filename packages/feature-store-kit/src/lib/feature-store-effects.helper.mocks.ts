// Segments
export const creativeListWithEditOutletSegments = [
  {
    data: { featureStoreKey: 'creativeList' },
    outlet: 'primary',
    params: {},
    url: [{ path: 'creatives', parameters: {} }]
  },
  {
    data: {},
    outlet: 'dialog1',
    params: { path: 'creative-editor', creativeId: '1313' },
    url: [{ path: 'creative-editor', parameters: { creativeId: '1313' } }]
  }
]
export const creativeListOnBrandSegments = [
  { data: {}, outlet: 'primary', params: {}, url: [{ path: 'settings', parameters: {} }] },
  { data: {}, outlet: 'primary', params: {}, url: [{ path: 'brands', parameters: {} }] },
  {
    data: { featureStoreKey: 'brandWrapper' },
    outlet: 'primary',
    params: { brandId: '302' },
    url: [{ path: '302', parameters: {} }]
  },
  {
    data: { featureStoreKey: 'creativeList' },
    outlet: 'primary',
    params: { search: 'a', status: '0' },
    url: [{ path: 'creatives', parameters: { search: 'a', status: '0' } }]
  }
]
export const creativeListSegments = [
  {
    data: { featureStoreKey: 'creativeList' },
    outlet: 'primary',
    params: {},
    url: [{ path: 'creatives', parameters: {} }]
  }
]
export const inventoriesSegments = [
  {
    data: { featureStoreKey: 'inventoryList' },
    outlet: 'primary',
    params: {},
    url: [{ path: 'inventory', parameters: {} }]
  }
]
export const inventoriesSegmentsWithDialogOnCreativeListSegments = [
  {
    data: { featureStoreKey: 'inventoryList' },
    outlet: 'primary',
    params: {},
    url: [{ path: 'inventory', parameters: {} }]
  },
  {
    data: { featureStoreKey: 'creativeList' },
    outlet: 'dialog1',
    params: {},
    url: [{ path: 'creatives', parameters: {} }]
  }
]

// FSKeys
export const creativeListFSKey = 'creativeList'
export const brandWrapperFSKey = 'brandWrapper'
