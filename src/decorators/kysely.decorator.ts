import { Inject } from "@nestjs/common";
import { KYSELY_MODULE_CONNECTION_TOKEN } from "../constants";

export const InjectKysely = () => Inject(KYSELY_MODULE_CONNECTION_TOKEN);
