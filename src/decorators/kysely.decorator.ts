import { Inject } from "@nestjs/common";
import { KYSELY_MODULE_CONNECTION_TOKEN } from "../constants/index.js";

export const InjectKysely = (namespace?: string) =>
  Inject(KYSELY_MODULE_CONNECTION_TOKEN(namespace));
