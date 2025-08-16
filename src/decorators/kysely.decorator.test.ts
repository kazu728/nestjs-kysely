import { describe, test, expect, beforeEach } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { Kysely, PostgresDialect, SqliteDialect } from "kysely";
import { Pool } from "pg";
import { KyselyModule } from "../kysely.module";
import { InjectKysely } from "./kysely.decorator";
import Database from "better-sqlite3";

describe("InjectKysely", () => {
  let module: TestingModule;

  class TestService {
    constructor(@InjectKysely() readonly db: Kysely<unknown>) {}
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        KyselyModule.forRoot({
          dialect: new PostgresDialect({
            pool: new Pool({
              host: "127.0.0.1",
              user: "root",
              password: "password",
              database: "kysely_test",
            }),
          }),
        }),
      ],
      providers: [TestService],
    }).compile();
  });

  test("should inject the kysely client", () => {
    const testService = module.get(TestService);

    expect(testService).toHaveProperty("db");
    expect(testService.db).toBeInstanceOf(Kysely);
  });
});

describe("InjectKysely with forRootAsync", () => {
  let module: TestingModule;

  class TestService {
    constructor(@InjectKysely() readonly db: Kysely<unknown>) {}
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        KyselyModule.forRootAsync({
          useFactory: () => ({
            dialect: new PostgresDialect({
              pool: new Pool({
                host: "127.0.0.1",
                user: "root",
                password: "password",
                database: "kysely_test",
              }),
            }),
          }),
        }),
      ],
      providers: [TestService],
    }).compile();
  });

  test("should inject the kysely client", () => {
    const testService = module.get(TestService);

    expect(testService).toHaveProperty("db");
    expect(testService.db).toBeInstanceOf(Kysely);
  });
});

describe("InjectKysely with two namespaces", () => {
  let module: TestingModule;

  class TestService {
    constructor(
      @InjectKysely("firstNamespace") readonly firstDB: Kysely<unknown>,
      @InjectKysely("secondNamespace") readonly secondDB: Kysely<unknown>,
    ) {}
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        KyselyModule.forRoot([
          {
            namespace: "firstNamespace",
            dialect: new PostgresDialect({
              pool: new Pool({
                host: "127.0.0.1",
                user: "root",
                password: "password",
                database: "kysely_test",
              }),
            }),
          },
          {
            namespace: "secondNamespace",
            dialect: new SqliteDialect({
              database: new Database(),
            }),
          },
        ]),
      ],
      providers: [TestService],
    }).compile();
  });

  test("should inject the kysely client in both namespaces", () => {
    const testService = module.get(TestService);

    expect(testService).toHaveProperty("firstDB");
    expect(testService).toHaveProperty("secondDB");
    expect(testService.firstDB).toBeInstanceOf(Kysely);
    expect(testService.secondDB).toBeInstanceOf(Kysely);
  });
});

describe("InjectKysely with two namespaces with forRootAsync", () => {
  let module: TestingModule;

  class TestService {
    constructor(
      @InjectKysely("firstDB") readonly firstDB: Kysely<unknown>,
      @InjectKysely("secondDB") readonly secondDB: Kysely<unknown>,
    ) {}
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        KyselyModule.forRootAsync({
          namespace: "firstDB",
          useFactory: () => (
            {
              dialect: new PostgresDialect({
                pool: new Pool({
                  host: "127.0.0.1",
                  user: "root",
                  password: "password",
                  database: "kysely_test",
                }),
              }),
            }
          ),
        }),
        KyselyModule.forRootAsync({
          namespace: "secondDB",
          useFactory: () => (
            {
              dialect: new SqliteDialect({
                database: new Database(),
              }),
            }
          ),
        }),
      ],
      providers: [TestService],
    }).compile();
  });

  test("should inject the kysely client in both namespaces", () => {
    const testService = module.get(TestService);

    expect(testService).toHaveProperty("firstDB");
    expect(testService).toHaveProperty("secondDB");
    expect(testService.firstDB).toBeInstanceOf(Kysely);
    expect(testService.secondDB).toBeInstanceOf(Kysely);
  });
});
