import { Logger, Injectable } from '@nestjs/common';
import {MessageBuilder, SocketService} from "./socket.service";
import {NoPierAvailableError} from "../errors/NoPierAvailableError";
import {InjectModel} from "@nestjs/sequelize";
import {Pier} from "../db/pier.model";
import {RunnerPackage} from "../db/runnerpackage.model";
import {Robot} from "../db/robot";
import {IRobot} from "../models/robot/types";



@Injectable()
export class HarborService {

    private readonly logger = new Logger(HarborService.name);

    constructor(readonly socketService: SocketService,
                @InjectModel(RunnerPackage)
                private runnerPackageModel: typeof RunnerPackage,) {
    }

    async getAvailableRunnerPackages() {
        return this.runnerPackageModel.findAll({
            attributes: ["id", "name", "title", "description", "version", "createdAt", "logo", "updatedAt",
                "attributes", "parameters", "environmentVariables"]
        });
    }

}
