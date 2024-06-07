import { Module } from '@nestjs/common';
import { RobotsController } from './robots.controller';
import { RobotsService } from './robots.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Robot} from "../db/robot";
import {Credentials} from "../db/credentials.model";
import {Images} from "../db/images.model";
import {SocketService} from "../harbor/socket.service";
import {PiersService} from "../piers/piers.service";

@Module({
  controllers: [RobotsController],
  imports: [   SequelizeModule.forFeature([Images, Robot, Credentials])],
  providers: [RobotsService, SocketService, PiersService],
  exports: [RobotsService]
})
export class RobotsModule {}
