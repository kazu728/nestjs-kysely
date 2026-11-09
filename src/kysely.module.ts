import { DynamicModule, Module, Provider, Type } from "@nestjs/common";
import { KyselyConfig } from "kysely";
import {
  KYSELY_MODULE_CONNECTION_TOKEN,
  KYSELY_MODULE_OPTIONS_TOKEN,
} from "./kysely.constants";
import {
  KyselyConfigWithNamespace,
  KyselyModuleAsyncOptions,
  KyselyModuleOptionsFactory,
} from "./kysely.interfaces";
import { KyselyService } from "./kysely.service";

@Module({})
export class KyselyModule {
  public static forRoot(
    config: KyselyConfig | KyselyConfigWithNamespace[],
  ): DynamicModule {
    const providers = Array.isArray(config)
      ? config.map((entry) => createClientProvider(entry.namespace, entry))
      : [createClientProvider(undefined, config)];

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
      provide: KYSELY_MODULE_CONNECTION_TOKEN(options.namespace),
      useFactory: (config: KyselyConfig, service: KyselyService) =>
        service.createClient(config),
    };

    return {
      exports: [provider],
      global: true,
      imports: options.imports,
      module: KyselyModule,
      providers: [...createOptionsProviders(options), provider, KyselyService],
    };
  }
}

const createClientProvider = (
  namespace: string | undefined,
  config: KyselyConfig,
): Provider => ({
  inject: [KyselyService],
  provide: KYSELY_MODULE_CONNECTION_TOKEN(namespace),
  useFactory: (service: KyselyService) => service.createClient(config),
});

const createOptionsProviders = (
  options: KyselyModuleAsyncOptions,
): Provider[] => {
  if ("useFactory" in options) {
    const { inject, useFactory } = options;
    return [{ inject, provide: KYSELY_MODULE_OPTIONS_TOKEN, useFactory }];
  }
  if ("useExisting" in options) {
    return [createOptionsFactoryProvider(options.useExisting)];
  }
  if ("useClass" in options) {
    const { useClass } = options;
    return [
      createOptionsFactoryProvider(useClass),
      { provide: useClass, useClass },
    ];
  }
  // The type already requires one of them, but JavaScript callers bypass it.
  throw new Error(
    "KyselyModule.forRootAsync requires useFactory, useExisting or useClass",
  );
};

const createOptionsFactoryProvider = (
  optionsFactory: Type<KyselyModuleOptionsFactory>,
): Provider => ({
  inject: [optionsFactory],
  provide: KYSELY_MODULE_OPTIONS_TOKEN,
  useFactory: (factory: KyselyModuleOptionsFactory) =>
    factory.createKyselyModuleOptions(),
});
