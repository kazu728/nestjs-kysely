import { Provider } from "@nestjs/common";
import { Kysely, KyselyConfig } from "kysely";
import { KYSELY_MODULE_CONNECTION_TOKEN } from "../constants";

export const createKyselyClient = <DB>(config: KyselyConfig): Kysely<DB> =>
  new Kysely<DB>(config);

export const createKyselyProvider = (options: KyselyConfig): Provider => ({
  provide: KYSELY_MODULE_CONNECTION_TOKEN,
  useValue: createKyselyClient(options),
});
