import { Module } from '@nestjs/common';
import { PiersService } from './piers.service';
import { PiersController } from './piers.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../db/user.model";
import {Pier} from "../db/pier.model";

@Module({
  providers: [PiersService],
  controllers: [PiersController],
  imports: [SequelizeModule.forFeature([User, Pier])],
  exports: [PiersService]
})
export class PiersModule {}
