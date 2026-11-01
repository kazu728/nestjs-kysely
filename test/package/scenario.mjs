import assert from "node:assert/strict";

// Dependencies are passed in so that each entry point loads them in its own module format, as an application would.
export async function verify({ common, core, kysely, Database, nestjsKysely }) {
  const { InjectKysely, KyselyModule } = nestjsKysely;

  class Consumer {
    constructor(db) {
      this.db = db;
    }
  }
  InjectKysely("sqlite")(Consumer, undefined, 0);

  class AppModule {}
  common.Module({
    imports: [
      KyselyModule.forRootAsync({
        namespace: "sqlite",
        useFactory: () => ({
          dialect: new kysely.SqliteDialect({ database: new Database() }),
        }),
      }),
    ],
    providers: [Consumer],
  })(AppModule);

  const app = await core.NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  const { db } = app.get(Consumer);
  const { rows } = await kysely.sql`select 1 as one`.execute(db);
  assert.deepEqual(rows, [{ one: 1 }]);

  await app.close();
  await assert.rejects(kysely.sql`select 1`.execute(db));
}
