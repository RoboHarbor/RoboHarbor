import {forwardRef, Inject, Injectable, Logger} from '@nestjs/common';
import {MessageBuilder, SocketService} from "../harbor/socket.service";
import {NoRobotAvailable} from "../errors/NoRobotAvailable";
import {IRobot} from "../models/robot/types";
import {Robot} from "../db/robot";
import {InjectConnection, InjectModel} from "@nestjs/sequelize";
import {Sequelize, Transaction} from "sequelize";
import {RoboHarborError} from "../errors/RoboHarborError";
import {uniqueNamesGenerator, adjectives, colors, animals, Config} from 'unique-names-generator';
import {Credentials} from "../db/credentials.model";
import {Images} from "../db/images.model";
import {PiersService} from "../piers/piers.service";
const config: Config = {
    dictionaries: [adjectives, colors, animals],
    separator: '-',
};


@Injectable()
export class RobotsService {

    private readonly logger = new Logger(RobotsService.name);
    private logQueue: any = [];
    private saveLogTimer: any = null;
    private lastTimeSaved: Date;

    constructor(
                @Inject(forwardRef(() => SocketService))
                readonly socketService: SocketService,
                @Inject(forwardRef(() => PiersService))
                private pierService: PiersService,
                @InjectModel(Credentials)
                private credentialsModel: typeof Credentials,
                @InjectModel(Images)
                private imageModel: typeof Images,
                @InjectModel(Robot)
                private robotModel: typeof Robot,
                @InjectConnection()
                private sequelize: Sequelize,) {
    }

    static generateRandomSecret() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    attachFullInformationToRobot(bot: IRobot) {
        return new Promise(async (resolve, reject) => {
            if (!bot.id) {
                bot.id = Math.floor(Math.random() * 1000000);
            }
            if (!bot.identifier) {
                if (process.env.DEV_KUBERNETES !== "development") {
                    bot.identifier = uniqueNamesGenerator(config);
                }
                else {
                    bot.identifier = "your-test-robot-identifier";
                }
            }
            if (bot.source?.credentials) {
                bot.source.credentials = await this.credentialsModel.findOne({
                    where: {
                        id: bot.source.credentials.id
                    }
                });
            }
            return resolve(bot);
        });
    }

    async validateRobot(bot: any) {
        bot = await this.attachFullInformationToRobot(bot);
        return this.pierService.validateRobot(bot)
            .then((res) => {
                this.logger.debug("Robot validated: ", res);
                if (res.isError) {
                    throw new RoboHarborError(res.error_code, res.error, res);
                    return;
                }
                return {
                    ...res
                }
            })
    }


    async createRobot(bot: IRobot) {
        // Start a transaction to create a robot and add it to a pier
        this.sequelize.transaction(async (t: Transaction) => {

            const robot = new Robot();

            robot.name = bot.name;
            robot.source = bot.source;
            robot.robotContent = bot.robotContent;
            robot.image = bot.image;
            robot.robotContentValues = bot.robotContentValues;
            robot.config = bot.config;
            robot.type = bot.type;

            robot.secret = RobotsService.generateRandomSecret();

            robot.sourceInfo = bot.sourceInfo;
            robot.identifier = uniqueNamesGenerator(config);


            const createdRobot = await robot.save({transaction: t});

            return Promise.resolve(createdRobot);
        })
            .then((res) => {
                this.pierService.createRobot(res);
              return res;
            })
            .then((res) => {
            return Promise.resolve(res.dataValues);
            }
        )
        .catch((err) => {
           throw new RoboHarborError(991, "Creation Error", {error: err.message});
        });
    }

    async getAllRobots() {
        return Robot.findAll({
            nest: true,
        });
    }

    async getRobot(id: string) {
        return Robot.findOne({
            where: {
                id: id
            }
        })
        .then((res) => {
            if (res) {
                return res;
            }
            throw new RoboHarborError(404, "Robot not found");
        });
    }

    async getRobotPopulated(id: string) {
        return Robot.findOne({
            where: {
                id: id
            }
        })
        .then((res) => {
            if (res) {
                return this.expandRobotDetails(res);
            }
            throw new RoboHarborError(404, "Robot not found");
        });
    }

    async reloadSource(id: string) {
        const robot = await this.getRobot(id.toString());
        if (!robot) {
            throw new RoboHarborError(404, "Robot not found");
        }
        return this.socketService.sendMessageToRobotWithResponse(robot.identifier, MessageBuilder.reloadSourceMessage(robot))
            .then((res: any) => {
                robot.sourceInfo = res.sourceInfo;
                return robot.save();
            });
    }

    async runRobot(id: string) {
        const robot = await this.getRobot(id);
        if (!robot) {
            throw new RoboHarborError(404, "Robot not found");
        }
        robot.enabled = true;
        await robot.save();
        return this.pierService.runRobot(robot)
            .then((res) => {
                return res;
            });
    }

    async stopRobot(id: string) {
        const robot = await this.getRobot(id);
        if (!robot) {
            throw new RoboHarborError(404, "Robot not found");
        }
        robot.enabled = false;
        await robot.save();
        return this.pierService.stopRobot(robot)
            .then((res) => {
                return res;
            });
    }

    async updateRobot(id: string, bot: IRobot) {
        const robot = await this.getRobot(id);
        if (!robot) {
            throw new RoboHarborError(404, "Robot not found");
        }
        if (bot.name) {
            robot.name = bot.name;
        }
        if (bot.source) {
            robot.source = bot.source;
        }
        if (bot.robotContent) {
            robot.robotContent = bot.robotContent;
        }
        if (bot.image) {
            robot.image = bot.image;
        }
        if (bot.config) {
            robot.config = bot.config;
        }
        if (bot.type) {
            robot.type = bot.type;
        }
        if (bot.robotContentValues) {
            robot.robotContentValues = bot.robotContentValues;
        }
        robot.updatedAt = new Date();
        await robot.save();

        try {
            await this.pierService.checkForAllRobots();
        }
        catch (e) {
            this.logger.error("Error checking for all robots while updating: ", e);
        }



        return robot;
    }

    async deleteRobot(id: string) {
        const robot = await this.getRobot(id);
        if (!robot) {
            throw new RoboHarborError(404, "Robot not found");
        }
        await robot.destroy();
        return robot;
    }

    async getAllCredentials(columns: string[] = []) {
        const options = {
            nest: true,

        };
        if (columns.length > 0) {
            options['attributes'] = columns;
        }
        return this.credentialsModel.findAll(options);
    }

    async createCredentials(credentials: any) {
        return this.credentialsModel.create(credentials);
    }

    async updateSource(id: string) {
        const robot = await this.getRobot(id);
        if (!robot) {
            throw new RoboHarborError(404, "Robot not found");
        }
        robot.updatedAt = new Date();
        await robot.save();
        return this.pierService.updateSource(robot)
            .then((res) => {
                return res;
            });
    }

    async deleteRobotById(id: string) {
        const robot = await this.getRobot(id);
        if (!robot) {
            throw new RoboHarborError(404, "Robot not found");
        }
        await this.robotModel.destroy({where: {id: id}});
        return this.pierService.checkForAllRobots();
    }

    expandRobotDetails(r: IRobot) {
        return new Promise(async (resolve, reject) => {
           try {
               if (r.source) {
                   if (r.source.credentials) {
                       try {
                           const credentials = (await this.credentialsModel.findOne({
                               where: {
                                   id: r.source.credentials.id
                               },
                               nest: true
                           }));
                           r.source.credentials = credentials ? credentials.dataValues : null;
                       }
                       catch(e) {}

                   }
               }
               return resolve(r);
           }
          catch(e) {
              this.logger.error("Error expanding robot details: ", e);
              return resolve(r);
          }
        });
    }
}
