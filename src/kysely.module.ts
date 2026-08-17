import { DynamicModule, Module, Provider } from "@nestjs/common";
import { KyselyConfig } from "kysely";
import {
  KYSELY_MODULE_CONNECTION_TOKEN,
  KYSELY_MODULE_OPTIONS_TOKEN,
} from "./constants/kysely.constants";
import {
  createKyselyClient,
  createKyselyProvider,
} from "./factories/kysely-client.factory";
import {
  KyselyConfigWithNamespace,
  KyselyModuleAsyncOptions,
} from "./kysely.interfaces";
import { createAsyncProviders } from "./providers/kysely.provider-factory";
import { KyselyService } from "./kysely.service";

@Module({})
export class KyselyModule {
  public static forRoot(
    config: KyselyConfig | KyselyConfigWithNamespace[],
  ): DynamicModule {
    const providers: Provider[] = createKyselyProvider(config);

    return {
      exports: providers,
      global: true,
      module: KyselyModule,
      providers: [...providers, KyselyService],
    };
  }

  public static forRootAsync(options: KyselyModuleAsyncOptions): DynamicModule {
    const provider: Provider = {
      inject: [KYSELY_MODULE_OPTIONS_TOKEN, KyselyService],
      provide: KYSELY_MODULE_CONNECTION_TOKEN(options?.namespace),
      useFactory: (config: KyselyConfig, service: KyselyService) =>
        createKyselyClient({ config, service }),
    };

    return {
      exports: [provider],
      global: true,
      imports: options.imports,
      module: KyselyModule,
      providers: [...createAsyncProviders(options), provider, KyselyService],
    };
  }
}
