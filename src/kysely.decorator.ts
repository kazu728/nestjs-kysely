import { Inject } from "@nestjs/common";
import { KYSELY_MODULE_CONNECTION_TOKEN } from "./kysely.constants";

export const InjectKysely = (namespace?: string): PropertyDecorator & ParameterDecorator =>
  Inject(KYSELY_MODULE_CONNECTION_TOKEN(namespace));
