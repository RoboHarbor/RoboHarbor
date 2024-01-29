import { Module } from '@nestjs/common';
import { HarborController } from './harbor.controller';
import { HarborService } from './harbor.service';
import {SocketService} from "./socket.service";
import {PiersService} from "../piers/piers.service";
import {PiersModule} from "../piers/piers.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../db/user.model";
import {Pier} from "../db/pier.model";
import {RunnerPackage} from "../db/runnerpackage.model";
import {Robot} from "../db/robot";
import {LogModule} from "../log/log.module";
import {RobotsModule} from "../robots/robots.module";
import {RobotsService} from "../robots/robots.service";

@Module({
  controllers: [HarborController],
  imports: [PiersModule, LogModule, RobotsModule, SequelizeModule.forFeature([RunnerPackage, Robot, Pier])],
  providers: [HarborService, SocketService],
  exports: [SocketService]
})
export class HarborModule {}
