import { Logger, OnApplicationShutdown } from "@nestjs/common";
import { Kysely, KyselyConfig } from "kysely";

export class KyselyService implements OnApplicationShutdown {
  private readonly logger = new Logger("KyselyModule");
  private readonly clients = new Set<Kysely<any>>();

  createClient(config: KyselyConfig): Kysely<any> {
    const client = new Kysely<any>(config);
    this.clients.add(client);
    return client;
  }

  // Nest 11 does not catch errors thrown here, so one failure would stop the remaining clients and modules from shutting down.
  async onApplicationShutdown() {
    for (const client of this.clients) {
      try {
        await client.destroy();
      } catch (e) {
        this.logger.error(`Failed to destroy Kysely client: ${e}`);
      }
    }
  }
}
