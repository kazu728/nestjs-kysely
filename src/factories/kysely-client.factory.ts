import { Provider } from '@nestjs/common'
import {
  Kysely,
  MysqlDialect,
  MysqlDialectConfig,
  PostgresDialect,
  PostgresDialectConfig,
} from 'kysely'
import { KYSELY_MODULE_CONNECTION_TOKEN } from '../constants'
import { DbDiarect, KyselyOptions } from '../kysely.interfaces'

export const createDiarect = (options: KyselyOptions): DbDiarect => {
  const { engine, ...restOptions } = options

  switch (engine) {
    case 'mysql':
      return new MysqlDialect(restOptions as MysqlDialectConfig)
    case 'postgresql':
      return new PostgresDialect(restOptions as PostgresDialectConfig)
  }
}

export const createKyselyClient = <T>(options: KyselyOptions): Kysely<T> =>
  new Kysely<T>({ dialect: createDiarect(options) })

export const createKyselyProvider = (options: KyselyOptions): Provider => ({
  provide: KYSELY_MODULE_CONNECTION_TOKEN,
  useValue: createKyselyClient(options),
})
