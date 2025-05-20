import { Provider } from "@nestjs/common";
import { KYSELY_MODULE_OPTIONS_TOKEN } from "../constants/index.js";
import {
  KyselyModuleAsyncOptions,
  KyselyModuleOptionsFactory,
} from "../kysely.interfaces.js";

export const createAsyncProviders = (
  options: KyselyModuleAsyncOptions,
): Provider[] => {
  const { useExisting, useFactory, useClass } = options;
  if (useExisting || useFactory) return [createAsyncOptionsProvider(options)];
  if (!useClass) throw new Error("Invalid options");

  return [createAsyncOptionsProvider(options), { provide: useClass, useClass }];
};

export const createAsyncOptionsProvider = (
  options: KyselyModuleAsyncOptions,
): Provider => {
  const { useFactory, inject, useExisting, useClass } = options;
  if (useFactory) {
    return {
      inject,
      provide: KYSELY_MODULE_OPTIONS_TOKEN,
      useFactory,
    };
  }

  if (useExisting) {
    return {
      inject: [useExisting || useClass],
      provide: KYSELY_MODULE_OPTIONS_TOKEN,
      useFactory: (optionsFactory: KyselyModuleOptionsFactory) =>
        optionsFactory.createKyselyModuleOptions(),
    };
  }

  throw new Error("Invalid options");
};
