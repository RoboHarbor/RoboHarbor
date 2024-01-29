import {Logger, Module} from '@nestjs/common';
import { UiService } from './ui.service';
import { UiController } from './ui.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../db/user.model";
import {RunnerPackage} from "../db/runnerpackage.model";

@Module({
  providers: [UiService],
  imports: [SequelizeModule.forFeature([User, RunnerPackage])],
  controllers: [UiController]
})
export class UiModule {
  private readonly logger = new Logger(UiModule.name);

  constructor(private ser: UiService) {
  }

  async onModuleInit() {
    this.logger.verbose(`The module has been initialized.`);
    await this.ser.initializeDatabase();
  }

}
