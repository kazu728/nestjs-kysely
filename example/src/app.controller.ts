import { Controller, Get } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from './@types';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @InjectKysely() private readonly db: DB,
    private readonly appService: AppService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const result = await this.db
      .selectFrom('person')
      .innerJoin('pet', 'pet.owner_id', 'person.id')
      .selectAll()
      .execute();

    console.log(`result:${JSON.stringify(result)}`);
    return this.appService.getHello();
  }
}
