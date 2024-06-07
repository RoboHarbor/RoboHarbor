import { Module } from '@nestjs/common';
import { HarborController } from './harbor.controller';
import { HarborService } from './harbor.service';
import {SocketService} from "./socket.service";
import {PiersService} from "../piers/piers.service";
import {PiersModule} from "../piers/piers.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {Robot} from "../db/robot";
import {RobotsModule} from "../robots/robots.module";
import {RobotsService} from "../robots/robots.service";
import {Images} from "../db/images.model";

@Module({
  controllers: [HarborController],
  imports: [RobotsModule, SequelizeModule.forFeature([Images, Robot])],
  providers: [HarborService, SocketService],
  exports: [SocketService]
})
export class HarborModule {}
