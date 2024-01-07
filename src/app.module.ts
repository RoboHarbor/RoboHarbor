import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';
import { UiModule } from './ui/ui.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UiModule],
})
export class AppModule {}
