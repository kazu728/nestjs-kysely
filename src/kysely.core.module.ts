import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { KyselyConfig } from "kysely";
import {
  KYSELY_MODULE_CONNECTION_TOKEN,
  KYSELY_MODULE_OPTIONS_TOKEN,
} from "./constants";
import { createKyselyClient, createKyselyProvider } from "./factories";
import { KyselyConfigWithNamespace, KyselyModuleAsyncOptions } from "./kysely.interfaces";
import { createAsyncProviders } from "./providers";

@Global()
@Module({})
export class KyselyCoreModule {
  public static forRoot(config: KyselyConfig | KyselyConfigWithNamespace[]): DynamicModule {
    const providers: Provider[] = createKyselyProvider(config);

    return {
      exports: providers,
      module: KyselyCoreModule,
      providers: providers,
    };
  }

  public static forRootAsync(options: KyselyModuleAsyncOptions): DynamicModule {
    const provider: Provider = {
      inject: [KYSELY_MODULE_OPTIONS_TOKEN],
      provide: KYSELY_MODULE_CONNECTION_TOKEN(options?.namespace),
      useFactory: (config: KyselyConfig) => createKyselyClient(config),
    };

    return {
      exports: [provider],
      imports: options.imports,
      module: KyselyCoreModule,
      providers: [...createAsyncProviders(options), provider],
    };
  }
}
