import {Injectable, Logger} from '@nestjs/common';
import {MessageBuilder, SocketService} from "../harbor/socket.service";
import {NoPierAvailableError} from "../errors/NoPierAvailableError";
import {IRobot} from "../models/robot/types";
import {Robot} from "../db/robot";
import {InjectConnection, InjectModel} from "@nestjs/sequelize";
import {RunnerPackage} from "../db/runnerpackage.model";
import {Sequelize, Transaction} from "sequelize";
import {Pier} from "../db/pier.model";
import {RoboHarborError} from "../errors/RoboHarborError";
import {uniqueNamesGenerator, adjectives, colors, animals, Config} from 'unique-names-generator';
import {Log} from "../db/log.model";
const config: Config = {
    dictionaries: [adjectives, colors, animals],
    separator: '-',
    seed: 120498,
};


@Injectable()
export class RobotsService {

    private readonly logger = new Logger(RobotsService.name);
    private logQueue: any = [];
    private saveLogTimer: any = null;
    private lastTimeSaved: Date;

    constructor(readonly socketService: SocketService,
                @InjectModel(RunnerPackage)
                private runnerPackageModel: typeof RunnerPackage,
                @InjectConnection()
                private sequelize: Sequelize,
                @InjectModel(Pier)
                private pierModel: typeof Pier,) {
    }

    async validateRobot(bot: any) {
        const pierId = this.socketService.getBestPier();
        if (pierId) {
            this.logger.log("Robot validated, pierId: " + pierId);

            return this.socketService.sendMessageWithResponse(pierId, MessageBuilder.validateRobotMessage(pierId, bot))
                .then((res) => {
                    return {
                        pierId: pierId,
                        ...res.response
                    }
                })
        }
        else {
            this.logger.error("Can not validate robot, no pier available");
            throw new NoPierAvailableError( {
                bot: bot
            });
        }
    }
    
    saveLogsLater() {
        return new Promise<void>((resolve, reject) => {
           try {
               
                if (this.logQueue.length > 0) {
                    const saveLogs = () => {
                        const logs = this.logQueue;
                        this.sequelize.transaction(async (t: Transaction) => {
                            await Log.bulkCreate(logs, {transaction: t});
                            return Promise.resolve();
                        })
                        .then(() => {
                            this.logQueue = [];
                            this.lastTimeSaved = new Date();
                            return resolve();
                        })
                        .catch((err) => {
                            this.logQueue = this.logQueue.concat(logs);
                            return reject(err);
                        });
                    }
                    
                    this.saveLogTimer = setTimeout(saveLogs, 1000);
                    if (this.lastTimeSaved) {
                        const diff = new Date().getTime() - this.lastTimeSaved.getTime();
                        if (diff > 3400) {
                            clearTimeout(this.saveLogTimer);
                            saveLogs();
                        }
                    }
                }
               
               return resolve();
           } 
           catch(e) {
               reject(e);
           }
        });
    }

    logRobot(robotId: number, level: string, logs: string) {
        return new Promise<void>((resolve, reject) => {
            try {
                this.logQueue.push({
                    robotId: robotId,
                    level: level,
                    logs: logs,
                    date: new Date()
                });
                this.saveLogsLater();
                return resolve();
            }
            catch (e) {
                reject(e);
            }
        });

    }

    async createRobot(bot: IRobot) {
        const pierId = this.socketService.getBestPier();
        if (pierId) {
            // Start a transaction to create a robot and add it to a pier
            this.sequelize.transaction(async (t: Transaction) => {


                this.logger.log("Robot created, pierId: " + pierId);
                const robot = new Robot();

                robot.name = bot.name;
                robot.source = bot.source;
                robot.runner = bot.runner;
                robot.config = bot.config;
                robot.type = bot.type;

                robot.identifier = uniqueNamesGenerator(config);


                const createdRobot = await robot.save({transaction: t});

                const pier = await this.pierModel.findOne({where: {identifier: pierId}, transaction: t});
                // ADd robot to pier
                await pier.$add('robot', createdRobot, {transaction: t});

                await pier.save({transaction: t});

                return Promise.resolve(createdRobot);
            })
                .then((res) => {
                    this.socketService.sendMessageWithoutResponse(pierId, MessageBuilder.reloadRobots())
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
        else {
            this.logger.error("Can not create robot, no pier available");
            throw new NoPierAvailableError( {
                bot: bot
            });
        }
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
        });
    }

    async runRobot(id: string) {
        const robot = await this.getRobot(id);
        if (!robot) {
            throw new RoboHarborError(404, "Robot not found");
        }
        robot.enabled = true;
        await robot.save();
        return this.socketService.sendMessageToRobotWithResponse(robot, MessageBuilder.runRobotMessage(robot))
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
        return this.socketService.sendMessageToRobotWithResponse(robot, MessageBuilder.stopRobotMessage(robot))
            .then((res) => {
                return res;
            });
    }

    async updateRobot(id: string, bot: IRobot) {
        const robot = await this.getRobot(id);
        if (!robot) {
            throw new RoboHarborError(404, "Robot not found");
        }
        robot.name = bot.name;
        robot.source = bot.source;
        robot.runner = bot.runner;
        robot.config = bot.config;
        robot.type = bot.type;
        await robot.save();
        return robot;
    }
}
