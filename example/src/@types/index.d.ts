import { Database } from 'interfaces/sample';
import { Kysely } from 'kysely';

export type DB = Kysely<Database>;
