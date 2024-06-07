import {Module} from "@nestjs/common";
import {LogWSService} from "./logws.service";
import {KubernetesLogService} from "../piers/kubernetes.log.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {Images} from "../db/images.model";
import {Robot} from "../db/robot";
import {PiersModule} from "../piers/piers.module";


@Module({
    controllers: [],
    imports: [PiersModule, SequelizeModule.forFeature([Images, Robot])],
    providers: [LogWSService, KubernetesLogService],
    exports: [LogWSService]
})
export class LogModule {}
