import { OnApplicationShutdown } from "@nestjs/common";
import { Kysely } from "kysely";

export class KyselyService implements OnApplicationShutdown {
  private storedActiveClients: Set<Kysely<any>> = new Set()

  get activeClients() {
    return Array.from(this.storedActiveClients)
  }

  addClient(client: Kysely<any>) {
    this.storedActiveClients.add(client)
  }

  async onApplicationShutdown() {
    for await (const client of this.activeClients) {
      try {
        await client.destroy()
        this.storedActiveClients.delete(client)
      } catch (e) {
        console.error(`Failed to destroy Kysely client: ${e}`)
      }
    }
  }
}