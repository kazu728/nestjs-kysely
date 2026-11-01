import { Provider } from "@nestjs/common";
import { KyselyConfig } from "kysely";
import { KyselyConfigWithNamespace } from "../kysely.interfaces";
import { KYSELY_MODULE_CONNECTION_TOKEN } from "../constants/kysely.constants";
import { KyselyService } from "../kysely.service";

export const createKyselyProvider = (
  options: KyselyConfig | KyselyConfigWithNamespace[],
): Provider[] => {
  if (Array.isArray(options)) {
    return options.map((opt) => {
      return {
        inject: [KyselyService],
        provide: KYSELY_MODULE_CONNECTION_TOKEN(opt.namespace),
        useFactory: (kyselyService: KyselyService) =>
          kyselyService.createClient(opt),
      };
    });
  } else {
    return [{
      inject: [KyselyService],
      provide: KYSELY_MODULE_CONNECTION_TOKEN(),
      useFactory: (kyselyService: KyselyService) =>
        kyselyService.createClient(options),
    }];
  }
};
