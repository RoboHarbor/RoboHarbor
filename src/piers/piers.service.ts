import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../db/user.model";
import {Pier} from "../db/pier.model";
import {Robot} from "../db/robot";

@Injectable()
export class PiersService {

    private readonly logger = new Logger(PiersService.name);
    constructor(
        @InjectModel(Pier)
        private pierModel: typeof Pier,) {
    }

    async registerPier(identifier: string, forceLastSeen: boolean = false) {
        if (identifier) {
            const pier = new Pier();
            pier.identifier = identifier;
            pier.lastSeenAt = new Date();
            const createdPier = await this.pierModel.findOne({where: {identifier: identifier}});
            if (!createdPier) {
                this.logger.log("Create pier with identifier: " + identifier)
                await pier.save();
            }
            else {
                if (createdPier.lastSeenAt < new Date(new Date().getTime()- (5 * 60 * 1000)) || forceLastSeen) {
                    this.logger.log("Registering pier with identifier: " + identifier)
                    createdPier.lastSeenAt = new Date();
                    await createdPier.save();
                }
            }
        }
        else {
            throw new Error("Identifier is missing");
        }
    }

    async getAll() {
        return Promise.resolve(await this.pierModel.findAll({
            nest: true
        }));
    }

    getPier(pierId: string) {
        return this.pierModel.findOne({where: {identifier: pierId}, include: [Robot]});
    }
}
