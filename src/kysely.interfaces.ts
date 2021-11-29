import { ModuleMetadata, Type } from '@nestjs/common'
import {
  MysqlDialect,
  MysqlDialectConfig,
  PostgresDialect,
  PostgresDialectConfig,
} from 'kysely'

export type DbEngine = { engine: 'mysql' | 'postgresql' }
export type DbDiarect = MysqlDialect | PostgresDialect
export type DbDiarectConfig = MysqlDialectConfig | PostgresDialectConfig

export type KyselyOptions = DbEngine & DbDiarectConfig

export interface KyselyModuleOptionsFactory {
  createKyselyModuleOptions(): Promise<KyselyOptions> | KyselyOptions
}

export interface KyselyModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[]
  useClass?: Type<KyselyOptions>
  useExisting?: Type<KyselyModuleOptionsFactory>
  useFactory?: (...args: unknown[]) => Promise<KyselyOptions> | KyselyOptions
}
