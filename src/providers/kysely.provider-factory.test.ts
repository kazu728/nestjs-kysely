import { describe, expect, test, vi } from "vitest";
import { FactoryProvider } from "@nestjs/common";
import { KyselyConfig, PostgresDialect } from "kysely";
import { KYSELY_MODULE_OPTIONS_TOKEN } from "../constants/kysely.constants";
import {
  KyselyModuleAsyncOptions,
  KyselyModuleOptionsFactory,
} from "../kysely.interfaces";
import {
  createAsyncOptionsProvider,
  createAsyncProviders,
} from "./kysely.provider-factory";
import { Pool } from "pg";

describe("Kysely provider factory", () => {
  const useFactory = (): KyselyConfig => ({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: "127.0.0.1",
        user: "root",
        password: "password",
        database: "kysely_test",
      }),
    }),
  });

  class ConfigFactory implements KyselyModuleOptionsFactory {
    createKyselyModuleOptions(): KyselyConfig {
      return useFactory();
    }
  }

  test("should get async provider", () => {
    const kyselyModuleAsyncOptions: KyselyModuleAsyncOptions = { useFactory };

    expect(createAsyncProviders(kyselyModuleAsyncOptions)).toStrictEqual([
      {
        inject: undefined,
        provide: KYSELY_MODULE_OPTIONS_TOKEN,
        useFactory,
      },
    ]);
  });

  test("should get options provider", () => {
    const kyselyModuleAsyncOptions: KyselyModuleAsyncOptions = { useFactory };

    expect(createAsyncOptionsProvider(kyselyModuleAsyncOptions)).toStrictEqual({
      inject: undefined,
      provide: KYSELY_MODULE_OPTIONS_TOKEN,
      useFactory,
    });
  });

  test("should get async providers with the options factory registered from useClass", () => {
    const kyselyModuleAsyncOptions: KyselyModuleAsyncOptions = {
      useClass: ConfigFactory,
    };

    expect(createAsyncProviders(kyselyModuleAsyncOptions)).toStrictEqual([
      {
        inject: [ConfigFactory],
        provide: KYSELY_MODULE_OPTIONS_TOKEN,
        useFactory: expect.any(Function),
      },
      { provide: ConfigFactory, useClass: ConfigFactory },
    ]);
  });

  test("should get async providers without registering the options factory from useExisting", () => {
    const kyselyModuleAsyncOptions: KyselyModuleAsyncOptions = {
      useExisting: ConfigFactory,
    };

    expect(createAsyncProviders(kyselyModuleAsyncOptions)).toStrictEqual([
      {
        inject: [ConfigFactory],
        provide: KYSELY_MODULE_OPTIONS_TOKEN,
        useFactory: expect.any(Function),
      },
    ]);
  });

  test("should get options provider delegating to the injected options factory", () => {
    const config = useFactory();
    const optionsFactory = { createKyselyModuleOptions: vi.fn(() => config) };

    const provider = createAsyncOptionsProvider({
      useClass: ConfigFactory,
    }) as FactoryProvider;

    expect(provider.useFactory(optionsFactory)).toBe(config);
    expect(optionsFactory.createKyselyModuleOptions).toHaveBeenCalledTimes(1);
  });

  test("should throw if no option is given", () => {
    expect(() => createAsyncProviders({})).toThrow("Invalid options");
    expect(() => createAsyncOptionsProvider({})).toThrow("Invalid options");
  });
});
