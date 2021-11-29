import { MysqlDialect, PostgresDialect } from 'kysely'
import { createDiarect } from '../factories'
import { DbEngine, KyselyOptions } from '../index'
import { commonOptions } from '../utility'

describe('Kysely client factory', () => {
  const createDirectOptions = (engine: DbEngine): KyselyOptions => ({
    ...engine,
    ...commonOptions,
  })

  test('should get mysql diarect', () => {
    const engine: DbEngine = { engine: 'mysql' }
    const dialect = createDiarect(createDirectOptions(engine))

    const output = new MysqlDialect(commonOptions)

    expect(dialect).toStrictEqual(output)
  })

  test('should get postgres diarect', () => {
    const engine: DbEngine = { engine: 'postgresql' }
    const dialect = createDiarect(createDirectOptions(engine))

    const output = new PostgresDialect(commonOptions)

    expect(dialect).toStrictEqual(output)
  })
})
