import { describe, expect, onTestFinished, test, vi } from "vitest";
import { Test } from "@nestjs/testing";
import { Module } from "@nestjs/common";
import { Kysely, KyselyConfig, SqliteDialect } from "kysely";
import Database from "better-sqlite3";
import { KYSELY_MODULE_CONNECTION_TOKEN } from "./kysely.constants";
import {
  KyselyModuleAsyncOptions,
  KyselyModuleOptionsFactory,
} from "./kysely.interfaces";
import { KyselyModule } from "./kysely.module";

class ConfigFactory implements KyselyModuleOptionsFactory {
  createKyselyModuleOptions(): KyselyConfig {
    return { dialect: new SqliteDialect({ database: new Database() }) };
  }
}

@Module({ providers: [ConfigFactory], exports: [ConfigFactory] })
class ConfigModule {}

const compile = async (options: KyselyModuleAsyncOptions) => {
  const module = await Test.createTestingModule({
    imports: [KyselyModule.forRootAsync(options)],
  }).compile();
  onTestFinished(() => module.close());
  return module;
};

describe("KyselyModule.forRootAsync", () => {
  test("should allow missing optional factory dependencies", async () => {
    const config = new ConfigFactory().createKyselyModuleOptions();
    const useFactory = vi.fn((options?: KyselyConfig) => options ?? config);
    const module = await compile({
      inject: [{ token: "OPTIONAL_CONFIG", optional: true }],
      useFactory,
    });

    expect(module.get(KYSELY_MODULE_CONNECTION_TOKEN())).toBeInstanceOf(Kysely);
    expect(useFactory).toHaveBeenCalledWith(undefined);
  });

  test("should create the client from the options factory given to useClass", async () => {
    const module = await compile({ useClass: ConfigFactory });

    expect(module.get(KYSELY_MODULE_CONNECTION_TOKEN())).toBeInstanceOf(Kysely);
  });

  test("should create the client from the options factory given to useExisting", async () => {
    const module = await compile({
      imports: [ConfigModule],
      useExisting: ConfigFactory,
    });

    expect(module.get(KYSELY_MODULE_CONNECTION_TOKEN())).toBeInstanceOf(Kysely);
  });

  test("should throw without useFactory, useClass or useExisting", () => {
    expect(() => KyselyModule.forRootAsync({})).toThrow(
      "KyselyModule.forRootAsync requires useFactory, useExisting or useClass",
    );
  });
});
