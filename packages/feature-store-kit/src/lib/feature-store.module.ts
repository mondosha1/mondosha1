import { Inject, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core'
import { FeatureStoreEffectsFactory } from './feature-store.effects'
import { FeatureStoreFacadeFactory } from './feature-store.facade'
import { FeatureStoreFormFactory } from './feature-store.form'
import { FeatureStoreFramework } from './feature-store.framework'
import { FEATURE_STORE_FORROOT_GUARD, FEATURE_STORE_OPTIONS, FeatureStoreModuleOptions } from './feature-store.state'
import { SubmitBeforeLeavingGuard } from './submit-before-leaving.guard'
import { SubmitWithChildrenBeforeLeavingGuard } from './submit-with-children-before-leaving.guard'

export function provideForRootGuard(featureStoreFramework): 'guarded' | never {
  if (featureStoreFramework) {
    throw new Error(
      'FeatureStoreModule.forRoot() called twice. Lazy loaded modules should use FeatureStoreModule.forFeature() instead.'
    )
  }
  return 'guarded'
}

@NgModule()
export class FeatureStoreModule {
  public constructor(
    @Optional() @Inject(FEATURE_STORE_FORROOT_GUARD) guard: any,
    @Optional() @Inject(FEATURE_STORE_OPTIONS) options: FeatureStoreModuleOptions<any, any>,
    featureStoreFramework: FeatureStoreFramework
  ) {
    if (options) {
      featureStoreFramework.withFeatureStoreOptions(options)
    }
  }

  public static forFeature<State extends {}, RichState extends State = State>(
    options: FeatureStoreModuleOptions<State, RichState>
  ): ModuleWithProviders<FeatureStoreModule> {
    return {
      ngModule: FeatureStoreModule,
      providers: [
        {
          provide: FEATURE_STORE_OPTIONS,
          multi: true,
          useValue: options
        }
      ]
    }
  }

  public static forRoot<State extends {}, RichState extends State = State>(
    options?: FeatureStoreModuleOptions<State, RichState>
  ): ModuleWithProviders<FeatureStoreModule> {
    return {
      ngModule: FeatureStoreModule,
      providers: [
        FeatureStoreFramework,
        FeatureStoreFacadeFactory,
        FeatureStoreEffectsFactory,
        FeatureStoreFormFactory,
        SubmitBeforeLeavingGuard,
        SubmitWithChildrenBeforeLeavingGuard,
        ...(options
          ? [
              {
                provide: FEATURE_STORE_OPTIONS,
                multi: true,
                useValue: options
              }
            ]
          : []),
        {
          provide: FEATURE_STORE_FORROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[FeatureStoreFramework, new Optional(), new SkipSelf()]]
        }
      ]
    }
  }
}
