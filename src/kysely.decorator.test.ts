import { afterEach, describe, expect, test } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { Kysely, KyselyConfig, SqliteDialect } from "kysely";
import Database from "better-sqlite3";
import { InjectKysely } from "./kysely.decorator";
import { KyselyModule } from "./kysely.module";

const sqlite = (): KyselyConfig => ({
  dialect: new SqliteDialect({ database: new Database() }),
});

class DefaultConsumer {
  constructor(@InjectKysely() readonly db: Kysely<unknown>) {}
}

class NamespacedConsumer {
  constructor(
    @InjectKysely("first") readonly first: Kysely<unknown>,
    @InjectKysely("second") readonly second: Kysely<unknown>,
  ) {}
}

describe("InjectKysely", () => {
  let module: TestingModule;

  afterEach(() => module.close());

  test("should inject the client registered with forRoot", async () => {
    module = await Test.createTestingModule({
      imports: [KyselyModule.forRoot(sqlite())],
      providers: [DefaultConsumer],
    }).compile();

    expect(module.get(DefaultConsumer).db).toBeInstanceOf(Kysely);
  });

  test("should inject the client registered with forRootAsync", async () => {
    module = await Test.createTestingModule({
      imports: [KyselyModule.forRootAsync({ useFactory: sqlite })],
      providers: [DefaultConsumer],
    }).compile();

    expect(module.get(DefaultConsumer).db).toBeInstanceOf(Kysely);
  });

  test("should inject each namespaced client registered with forRoot", async () => {
    module = await Test.createTestingModule({
      imports: [
        KyselyModule.forRoot([
          { namespace: "first", ...sqlite() },
          { namespace: "second", ...sqlite() },
        ]),
      ],
      providers: [NamespacedConsumer],
    }).compile();

    const { first, second } = module.get(NamespacedConsumer);
    expect(first).toBeInstanceOf(Kysely);
    expect(second).toBeInstanceOf(Kysely);
    expect(first).not.toBe(second);
  });

  test("should inject each namespaced client registered with forRootAsync", async () => {
    module = await Test.createTestingModule({
      imports: [
        KyselyModule.forRootAsync({ namespace: "first", useFactory: sqlite }),
        KyselyModule.forRootAsync({ namespace: "second", useFactory: sqlite }),
      ],
      providers: [NamespacedConsumer],
    }).compile();

    const { first, second } = module.get(NamespacedConsumer);
    expect(first).toBeInstanceOf(Kysely);
    expect(second).toBeInstanceOf(Kysely);
    expect(first).not.toBe(second);
  });
});
