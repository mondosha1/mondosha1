import { Inject, Injectable, Optional } from '@angular/core'
import { append } from '@mondosha1/array'
import { of } from '@mondosha1/core'
import { find, isNil, some, tap, uniq } from 'lodash/fp'
import { FEATURE_STORE_OPTIONS, FeatureStoreModuleOptions } from './feature-store.state'

@Injectable()
export class FeatureStoreFramework {
  private featureStoreOptions: FeatureStoreModuleOptions<any>[] = []

  public constructor(@Optional() @Inject(FEATURE_STORE_OPTIONS) options: FeatureStoreModuleOptions<any>) {
    if (options) {
      this.withFeatureStoreOptions(options)
    }
  }

  public getFeatureStoreOptions<State>(featureStoreKey: string): FeatureStoreModuleOptions<State> | never {
    return of(this.featureStoreOptions).pipe(
      find<FeatureStoreModuleOptions<State>>({ featureStoreKey }),
      tap(options => {
        if (isNil(options)) {
          throw new Error(`Options for feature store key "${featureStoreKey}" could not be found`)
        }
      })
    )
  }

  public withFeatureStoreOptions(featureStoreOptions: FeatureStoreModuleOptions<any>): void {
    this.checkDuplicatedFeatureStoreKeys(featureStoreOptions)

    this.featureStoreOptions = of(this.featureStoreOptions).pipe(append(featureStoreOptions), uniq)
  }

  private checkDuplicatedFeatureStoreKeys(featureStoreOptions: FeatureStoreModuleOptions<any>): void | never {
    of(this.featureStoreOptions).pipe(
      some({ featureStoreKey: featureStoreOptions.featureStoreKey }),
      tap(duplicated => {
        if (duplicated) {
          throw new Error(`Duplicated feature store key detected for "${featureStoreOptions.featureStoreKey}"`)
        }
      })
    )
  }
}
