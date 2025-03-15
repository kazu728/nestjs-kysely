# nestjs-kysely

[![npm version](https://badge.fury.io/js/nestjs-kysely.svg)](https://badge.fury.io/js/nestjs-kysely.svg)
[![check](https://github.com/kzmat/nestjs-kysely/actions/workflows/check.yml/badge.svg)](https://github.com/kzmat/nestjs-kysely/actions/workflows/check.yml)
[![codecov](https://codecov.io/gh/kzmat/nestjs-kysely/branch/master/graph/badge.svg?token=5PN87HH33L)](https://codecov.io/gh/kzmat/nestjs-kysely)

`nestjs-kysely` implements a module that provides the client of Kysely, which is
a type-safe query builder.

## install

```
npm i nestjs-kysely kysely
```

## Example

```
npm i nestjs-kysely kysely mysql2
```

Register KyselyModule for your app.

```ts
import { Module } from "@nestjs/common";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { KyselyModule } from "nestjs-kysely";
import { AppController } from "./app.controller";

@Module({
  imports: [
    KyselyModule.forRoot({
      dialect: new MysqlDialect({
        pool: createPool({
          host: "127.0.0.1",
          user: "root",
          password: "password",
          database: "kysely_test",
        }),
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

You can then inject the Kysely client into any of your injectables by using a
custom decorator.

```ts
import { Controller, Get } from "@nestjs/common";
import { InjectKysely } from "nestjs-kysely";
import { Kysely } from "kysely";
import { DB } from "./@types";

@Controller()
export class AppController {
  constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

  @Get()
  async getHello(): Promise<string> {
    const result = await this.db
      .selectFrom("person")
      .innerJoin("pet", "pet.owner_id", "person.id")
      .selectAll()
      .execute();

    return JSON.stringify(result);
  }
}
```

# Multiple namespace

Register KyselyModule with multiple DBs for your app.

## Example forRoot

```ts
import { Module } from "@nestjs/common";
import { MysqlDialect, SqliteDialect } from "kysely";
import { createPool } from "mysql2";
import Database from "better-sqlite3";
import { KyselyModule } from "nestjs-kysely";
import { AppController } from "./app.controller";

@Module({
  imports: [
    KyselyModule.forRoot([
      {
        namespace: "mysql",
        dialect: new MysqlDialect({
          pool: createPool({
            host: "127.0.0.1",
            user: "root",
            password: "password",
            database: "kysely_test",
          }),
        }),
      },
      {
        namespace: "sqlite",
        dialect: new SqliteDialect({
          database: new Database(),
        }),
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

## Example forRootAsync

```ts
import { Module } from "@nestjs/common";
import { MysqlDialect, SqliteDialect } from "kysely";
import { createPool } from "mysql2";
import Database from "better-sqlite3";
import { KyselyModule } from "nestjs-kysely";
import { AppController } from "./app.controller";

@Module({
  imports: [
    KyselyModule.forRootAsync({
      namespace: "mysql",
      useFactory: () => (
        {
          dialect: new MysqlDialect({
            pool: createPool({
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
      namespace: "sqlite",
      useFactory: () => (
        {
          dialect: new SqliteDialect({
            database: new Database(),
          }),
        }
      ),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

## Use it

You can then inject the Kysely client into any of your injectables by using a
custom decorator with namespace as input.

```ts
import { Controller, Get } from "@nestjs/common";
import { InjectKysely } from "nestjs-kysely";
import { Kysely } from "kysely";
import { DB } from "./@types";

@Controller()
export class AppController {
  constructor(
    @InjectKysely("mysql") private readonly mysql: Kysely<unknown>,
    @InjectKysely("sqlite") private readonly sqlite: Kysely<unknown>,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const result = await this.db
      .selectFrom("person")
      .innerJoin("pet", "pet.owner_id", "person.id")
      .selectAll()
      .execute();

    return JSON.stringify(result);
  }
}
```

# License

MIT
