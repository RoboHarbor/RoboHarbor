import { Module } from '@nestjs/common';
import { PiersService } from './piers.service';
import { PiersController } from './piers.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../db/user.model";
import {Images} from "../db/images.model";
import {HarborModule} from "../harbor/harbor.module";
import {Robot} from "../db/robot";
import {KubernetesLogService} from "./kubernetes.log.service";

@Module({
  providers: [PiersService, KubernetesLogService],
  controllers: [PiersController],
  imports: [HarborModule, SequelizeModule.forFeature([User, Images, Robot])],
  exports: [PiersService, KubernetesLogService]
})
export class PiersModule {}
