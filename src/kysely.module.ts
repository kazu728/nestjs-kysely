import { DynamicModule, Module } from '@nestjs/common'
import { KyselyCoreModule } from './kysely.core.module'
import { KyselyModuleAsyncOptions, KyselyOptions } from './kysely.interfaces'

@Module({})
export class KyselyModule {
  public static forRoot(options: KyselyOptions): DynamicModule {
    return {
      module: KyselyModule,
      imports: [KyselyCoreModule.forRoot(options)],
    }
  }

  public static forRootAsync(options: KyselyModuleAsyncOptions): DynamicModule {
    return {
      module: KyselyModule,
      imports: [KyselyCoreModule.forRootAsync(options)],
    }
  }
}
