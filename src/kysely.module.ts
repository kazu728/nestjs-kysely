import { DynamicModule, Module } from "@nestjs/common";
import { KyselyConfig } from "kysely";
import { KyselyCoreModule } from "./kysely.core.module";
import { KyselyModuleAsyncOptions } from "./kysely.interfaces";

@Module({})
export class KyselyModule {
  public static forRoot(config: KyselyConfig): DynamicModule {
    return {
      module: KyselyModule,
      imports: [KyselyCoreModule.forRoot(config)],
    };
  }

  public static forRootAsync(options: KyselyModuleAsyncOptions): DynamicModule {
    return {
      module: KyselyModule,
      imports: [KyselyCoreModule.forRootAsync(options)],
    };
  }
}
