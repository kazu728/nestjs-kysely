import { describe, expect, test } from "vitest";
import { Test } from "@nestjs/testing";
import { Module } from "@nestjs/common";
import { Kysely, KyselyConfig, SqliteDialect } from "kysely";
import Database from "better-sqlite3";
import { KYSELY_MODULE_CONNECTION_TOKEN } from "./constants/kysely.constants";
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
});
