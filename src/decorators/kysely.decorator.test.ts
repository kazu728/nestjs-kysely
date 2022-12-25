import { Test, TestingModule } from "@nestjs/testing";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { KyselyModule } from "../kysely.module";
import { InjectKysely } from "./kysely.decorator";

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
