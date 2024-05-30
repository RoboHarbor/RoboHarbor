import { Module } from '@nestjs/common';
import { PiersService } from './piers.service';
import { PiersController } from './piers.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../db/user.model";
import {Images} from "../db/images.model";
import {HarborModule} from "../harbor/harbor.module";
import {Robot} from "../db/robot";

@Module({
  providers: [PiersService],
  controllers: [PiersController],
  imports: [HarborModule, SequelizeModule.forFeature([User, Images, Robot])],
  exports: [PiersService]
})
export class PiersModule {}
