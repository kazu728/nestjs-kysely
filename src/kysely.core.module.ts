import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { KyselyConfig } from "kysely";
import {
  KYSELY_MODULE_CONNECTION_TOKEN,
  KYSELY_MODULE_OPTIONS_TOKEN,
} from "./constants";
import { createKyselyClient, createKyselyProvider } from "./factories";
import { KyselyModuleAsyncOptions } from "./kysely.interfaces";
import { createAsyncProviders } from "./providers";

@Global()
@Module({})
export class KyselyCoreModule extends OnModuleDestroy {
  private static client: Kysely<unknown>;
  
  public static forRoot(config: KyselyConfig): DynamicModule {
    const provider: Provider = createKyselyProvider(config);
    KyselyCoreModule.client = provider.useValue;
    
    return {
      exports: [provider],
      module: KyselyCoreModule,
      providers: [provider],
    };
  }

  public static forRootAsync(options: KyselyModuleAsyncOptions): DynamicModule {
    const provider: Provider = {
      inject: [KYSELY_MODULE_OPTIONS_TOKEN],
      provide: KYSELY_MODULE_CONNECTION_TOKEN,
      useFactory: (config: KyselyConfig) => createKyselyClient(config),
    };

    return {
      exports: [provider],
      imports: options.imports,
      module: KyselyCoreModule,
      providers: [...createAsyncProviders(options), provider],
    };
  }

  async onModuleDestroy() {
    await KyselyCoreModule.client?.destroy();
  }
}
