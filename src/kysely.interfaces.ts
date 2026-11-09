import { FactoryProvider, ModuleMetadata, Type } from "@nestjs/common";
import { KyselyConfig } from "kysely";

export interface KyselyModuleOptionsFactory {
  createKyselyModuleOptions(): Promise<KyselyConfig> | KyselyConfig;
}

export interface KyselyModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  namespace?: string;
  inject?: FactoryProvider["inject"];
  useClass?: Type<KyselyModuleOptionsFactory>;
  useExisting?: Type<KyselyModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<KyselyConfig> | KyselyConfig;
}

export interface KyselyConfigWithNamespace extends KyselyConfig {
  namespace: string;
}
