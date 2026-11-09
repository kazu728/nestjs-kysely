import { beforeEach, describe, expect, test, vi } from "vitest";
import { Logger } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Kysely, SqliteDialect } from "kysely";
import Database from "better-sqlite3";
import { KYSELY_MODULE_CONNECTION_TOKEN } from "./kysely.constants";
import { KyselyModule } from "./kysely.module";

describe("KyselyService - onApplicationShutdown", () => {
  let module: TestingModule;
  let first: Kysely<unknown>;
  let second: Kysely<unknown>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        KyselyModule.forRoot([
          {
            namespace: "first",
            dialect: new SqliteDialect({ database: new Database() }),
          },
          {
            namespace: "second",
            dialect: new SqliteDialect({ database: new Database() }),
          },
        ]),
      ],
    }).compile();
    first = module.get(KYSELY_MODULE_CONNECTION_TOKEN("first"));
    second = module.get(KYSELY_MODULE_CONNECTION_TOKEN("second"));
  });

  test("should destroy every client on shutdown", async () => {
    const destroySpies = [first, second].map((client) =>
      vi.spyOn(client, "destroy")
    );

    await module.close();

    destroySpies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));
  });

  test("should log a client that fails to be destroyed and still destroy the rest", async () => {
    vi.spyOn(first, "destroy").mockRejectedValue(new Error("boom"));
    const secondDestroy = vi.spyOn(second, "destroy");
    using loggerError = vi.spyOn(Logger.prototype, "error")
      .mockImplementation(() => {});

    await module.close();

    expect(secondDestroy).toHaveBeenCalledTimes(1);
    expect(loggerError).toHaveBeenCalledWith(
      "Failed to destroy Kysely client: Error: boom",
    );
  });
});
