import { Abstract, ModuleMetadata, Type } from "@nestjs/common";
import { KyselyConfig } from "kysely";

type InjectType =
  (string | symbol | Type<any> | Abstract<any> | (() => void))[];

export interface KyselyModuleOptionsFactory {
  createKyselyModuleOptions(): Promise<KyselyConfig> | KyselyConfig;
}

export interface KyselyModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  inject?: InjectType;
  useClass?: Type<KyselyConfig>;
  useExisting?: Type<KyselyModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<KyselyConfig> | KyselyConfig;
}
