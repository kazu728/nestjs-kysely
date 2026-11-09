import { describe, expect, test, vi } from "vitest";
import { Test } from "@nestjs/testing";
import { Module } from "@nestjs/common";
import { Kysely, KyselyConfig, SqliteDialect } from "kysely";
import Database from "better-sqlite3";
import { KYSELY_MODULE_CONNECTION_TOKEN } from "./kysely.constants";
import { KyselyModuleOptionsFactory } from "./kysely.interfaces";
import { KyselyModule } from "./kysely.module";

class ConfigFactory implements KyselyModuleOptionsFactory {
  createKyselyModuleOptions(): KyselyConfig {
    return { dialect: new SqliteDialect({ database: new Database() }) };
  }
}

@Module({ providers: [ConfigFactory], exports: [ConfigFactory] })
class ConfigModule {}

describe("KyselyModule.forRootAsync", () => {
  test("should allow missing optional factory dependencies", async () => {
    const config = new ConfigFactory().createKyselyModuleOptions();
    const useFactory = vi.fn((options?: KyselyConfig) => options ?? config);
    const module = await Test.createTestingModule({
      imports: [
        KyselyModule.forRootAsync({
          inject: [{ token: "OPTIONAL_CONFIG", optional: true }],
          useFactory,
        }),
      ],
    }).compile();

    try {
      expect(module.get(KYSELY_MODULE_CONNECTION_TOKEN())).toBeInstanceOf(
        Kysely,
      );
      expect(useFactory).toHaveBeenCalledWith(undefined);
    } finally {
      await module.close();
    }
  });

  test("should create the client from the options factory given to useClass", async () => {
    const module = await Test.createTestingModule({
      imports: [KyselyModule.forRootAsync({ useClass: ConfigFactory })],
    }).compile();

    expect(module.get(KYSELY_MODULE_CONNECTION_TOKEN())).toBeInstanceOf(Kysely);
  });

  test("should create the client from the options factory given to useExisting", async () => {
    const module = await Test.createTestingModule({
      imports: [
        KyselyModule.forRootAsync({
          imports: [ConfigModule],
          useExisting: ConfigFactory,
        }),
      ],
    }).compile();

    expect(module.get(KYSELY_MODULE_CONNECTION_TOKEN())).toBeInstanceOf(Kysely);
  });

  test("should throw without useFactory, useExisting or useClass", () => {
    // @ts-expect-error: the type rejects these options, but JavaScript callers can still pass them.
    expect(() => KyselyModule.forRootAsync({})).toThrow(
      "KyselyModule.forRootAsync requires useFactory, useExisting or useClass",
    );
  });
});
