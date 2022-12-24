import { Test, TestingModule } from "@nestjs/testing";
import { Kysely, PostgresDialect } from "kysely";
import { KyselyModule } from "../kysely.module";
import { commonOptions } from "../utility";
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
            ...commonOptions,
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
