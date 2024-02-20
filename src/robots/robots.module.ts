import { Module } from '@nestjs/common';
import { RobotsController } from './robots.controller';
import { RobotsService } from './robots.service';
import {PiersModule} from "../piers/piers.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {RunnerPackage} from "../db/runnerpackage.model";
import {SocketService} from "../harbor/socket.service";
import {Robot} from "../db/robot";
import {Pier} from "../db/pier.model";
import {LogModule} from "../log/log.module";
import {Credentials} from "../db/credentials.model";

@Module({
  controllers: [RobotsController],
  imports: [PiersModule, LogModule, SequelizeModule.forFeature([RunnerPackage, Robot, Pier, Credentials])],
  providers: [RobotsService, SocketService],
  exports: [RobotsService]
})
export class RobotsModule {}
