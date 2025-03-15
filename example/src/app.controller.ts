import { Controller, Get } from "@nestjs/common";
import { InjectKysely } from "nestjs-kysely";
import { DB } from "./@types";

@Controller()
export class AppController {
  constructor(@InjectKysely() private readonly db: DB) {}

  @Get()
  async getHello(): Promise<string> {
    const result = await this.db
      .selectFrom("person")
      .innerJoin("pet", "pet.owner_id", "person.id")
      .selectAll()
      .execute();

    return JSON.stringify(result);
  }
}
