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
import { Module } from '@nestjs/common'
import { KyselyModule } from 'nestjs-kysely'

@Module({
  imports: [
    KyselyModule.forRoot({
      engine: 'mysql',
      host: '127.0.0.1',
      user: 'root',
      password: 'password',
      database: 'kysely_test',
    }),
  ],
})
export class AppModule {}
```

You can then inject the Kysely client into any of your injectables by using a custom decorator.

```ts
import { Controller, Get } from '@nestjs/common'
import { InjectKysely } from 'nestjs-kysely'
import { DB } from './@types'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(
    @InjectKysely() private readonly db: DB,
    private readonly appService: AppService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const result = await this.db
      .selectFrom('person')
      .innerJoin('pet', 'pet.owner_id', 'person.id')
      .selectAll()
      .execute()

    console.log(`result:${JSON.stringify(result)}`)
    return this.appService.getHello()
  }
}
```

# License

MIT
