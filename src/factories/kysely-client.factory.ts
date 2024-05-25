import { Provider } from "@nestjs/common";
import { Kysely, KyselyConfig } from "kysely";
import { KYSELY_MODULE_CONNECTION_TOKEN } from "../constants";
import { KyselyConfigWithNamespace } from "kysely.interfaces";

export const createKyselyClient = <DB>(config: KyselyConfig): Kysely<DB> =>
  new Kysely<DB>(config);

export const createKyselyProvider = (options: KyselyConfig | KyselyConfigWithNamespace[]): Provider[] => {
  if (Array.isArray(options)) {
    return options.map((opt) => {
      return {
        provide: KYSELY_MODULE_CONNECTION_TOKEN(opt.namespace),
        useValue: createKyselyClient(opt),
      };
    })
  } else {
    return [{
      provide: KYSELY_MODULE_CONNECTION_TOKEN(),
      useValue: createKyselyClient(options),
    }];
  }
}
