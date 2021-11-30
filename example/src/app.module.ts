import { Module } from '@nestjs/common';
import { KyselyModule } from 'nestjs-kysely';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    KyselyModule.forRoot({
      engine: 'mysql',
      host: '127.0.0.1',
      user: 'root',
      password: 'password',
      database: 'kysely_test',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
