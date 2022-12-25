# nestjs-kysely

[![npm version](https://badge.fury.io/js/nestjs-kysely.svg)](https://badge.fury.io/js/nestjs-kysely.svg)
[![test](https://github.com/kzmat/nestjs-kysely/actions/workflows/test.yml/badge.svg)](https://github.com/kzmat/nestjs-kysely/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/kzmat/nestjs-kysely/branch/master/graph/badge.svg?token=5PN87HH33L)](https://codecov.io/gh/kzmat/nestjs-kysely)

`nestjs-kysely` implements a module that provides the client of Kysely, which is a type-safe query builder.

## install

```
yarn add nestjs-kysely
```

## Example

```
yarn add nestjs-kysely mysql2
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

You can then inject the Kysely client into any of your injectables by using a custom decorator.

```ts
import { Controller, Get } from "@nestjs/common";
import { InjectKysely } from "nestjs-kysely";
import { DB } from "./@types";

@Controller()
export class AppController {
  constructor(@InjectKysely() private readonly db: DB) {}

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
