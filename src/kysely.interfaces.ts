import { FactoryProvider, ModuleMetadata, Type } from "@nestjs/common";
import { KyselyConfig } from "kysely";

export interface KyselyModuleOptionsFactory {
  createKyselyModuleOptions(): Promise<KyselyConfig> | KyselyConfig;
}

export type KyselyModuleAsyncOptions =
  & Pick<ModuleMetadata, "imports">
  & { namespace?: string }
  & (
    | {
      useFactory: (...args: any[]) => Promise<KyselyConfig> | KyselyConfig;
      inject?: FactoryProvider["inject"];
    }
    | { useExisting: Type<KyselyModuleOptionsFactory> }
    | { useClass: Type<KyselyModuleOptionsFactory> }
  );

export interface KyselyConfigWithNamespace extends KyselyConfig {
  namespace: string;
}
