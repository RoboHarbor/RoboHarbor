import { Logger, Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Images} from "../db/images.model";
import {SocketService} from "./socket.service";



@Injectable()
export class HarborService {

    private readonly logger = new Logger(HarborService.name);

    constructor(readonly socketService: SocketService,
                @InjectModel(Images)
                private imageModel: typeof Images,) {
    }

    async getAvailableRunnerPackages() {
        return this.imageModel.findAll({
            attributes: ["id", "name", "description", "imageContainerName", "version", "attributes"],
        });
    }

}
