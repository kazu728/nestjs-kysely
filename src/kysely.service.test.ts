import { Test, TestingModule } from "@nestjs/testing";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { KyselyModule } from "./kysely.module";
import { KyselyService } from "./kysely.service";

enum EDatabases {
  DB_1 = "kysely_test_1",
  DB_2 = "kysely_test_2",
}

const getDatabaseProps = ({ database }: { database: string }) => ({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: "127.0.0.1",
      user: "root",
      password: "password",
      database,
    }),
  }),
})

describe("KyselyService - onApplicationShutdown", () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
          KyselyModule.forRoot([
            {
              namespace: EDatabases.DB_1,
              ...getDatabaseProps({ database: EDatabases.DB_1 }),
            },
            {
              namespace: EDatabases.DB_2,
              ...getDatabaseProps({ database: EDatabases.DB_2 }),
            }
          ])
      ]
    }).compile();
  });

  test("should destroy all active Kysely clients on shutdown", async () => {
    const kyselyService = module.get(KyselyService);
    const spyOnApplicationShutdown = jest.spyOn(kyselyService, 'onApplicationShutdown');

    const destroySpies = kyselyService.activeClients.map(client =>
        jest.spyOn(client, 'destroy')
    );

    expect(kyselyService.activeClients.length).toBe(2);

    // Shutdown the application
    await module.close();

    expect(spyOnApplicationShutdown).toHaveBeenCalledTimes(1);
    expect(kyselyService.activeClients.length).toBe(0);
    destroySpies.forEach(spy => expect(spy).toHaveBeenCalledTimes(1));
  });

});
