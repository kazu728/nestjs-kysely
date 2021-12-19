import { Abstract, ModuleMetadata, Type } from '@nestjs/common'
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
type InjectType = (
  | string
  | symbol
  | Type<unknown>
  | Abstract<unknown>
  | (() => void)
)[]

export interface KyselyModuleOptionsFactory {
  createKyselyModuleOptions(): Promise<KyselyOptions> | KyselyOptions
}

export interface KyselyModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: InjectType
  useClass?: Type<KyselyOptions>
  useExisting?: Type<KyselyModuleOptionsFactory>
  useFactory?: (...args: unknown[]) => Promise<KyselyOptions> | KyselyOptions
}
