import { KYSELY_MODULE_OPTIONS_TOKEN } from '../constants'
import { KyselyModuleAsyncOptions, KyselyOptions } from '../kysely.interfaces'
import { commonOptions } from '../utility'
import {
  createAsyncOptionsProvider,
  createAsyncProviders,
} from './kysely.provider-factory'

describe('Kysely provider factory', () => {
  const useFactory = (): KyselyOptions => ({
    engine: 'mysql',
    ...commonOptions,
  })

  test('should get async provider', () => {
    const kyselyModuleAsyncOptions: KyselyModuleAsyncOptions = { useFactory }

    expect(createAsyncProviders(kyselyModuleAsyncOptions)).toStrictEqual([
      {
        inject: undefined,
        provide: KYSELY_MODULE_OPTIONS_TOKEN,
        useFactory,
      },
    ])
  })

  test('should get options provider', () => {
    const kyselyModuleAsyncOptions: KyselyModuleAsyncOptions = { useFactory }

    expect(createAsyncOptionsProvider(kyselyModuleAsyncOptions)).toStrictEqual({
      inject: undefined,
      provide: KYSELY_MODULE_OPTIONS_TOKEN,
      useFactory,
    })
  })
})
