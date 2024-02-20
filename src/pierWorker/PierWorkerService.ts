import * as fs from "fs";
import {IPierWSListener, PierWSClient} from "./PierWSClient";
import {IMessage, MessageBuilder, MessageTypes} from "../harbor/socket.service";
import {Logger} from "@nestjs/common";
import {validateRobotShell} from "./shell/ValidateRobotShell";
import {IRobot} from "../models/robot/types";
import {IRobotRunner, RobotRunner} from "./runner/RobotRunner";
import RobotFactory from "./RoboFactory";
import {cleanRobotData} from "../helper/robo";


export default class PierWorkerService implements IPierWSListener {
    private static generateRandomPierName(): string {
        return "Pier-" + Math.floor(Math.random() * 10000);
    }
    private runningRobots: IRobotRunner[] = [];

    private pierName: string;
    private readonly logger = new Logger(PierWorkerService.name);
    private service: PierWSClient;

    constructor(pierName: string = null) {
        if (pierName === null) {
            pierName = PierWorkerService.generateRandomPierName();
        }
        this.pierName = pierName;
    }

    public getPierName(): string {
        return this.pierName;
    }

    getBasePath(): string {
        return "."+this.getPierName();
    }

    initializeLocalDirectory() {
        if (!fs.existsSync(this.getBasePath())) {
            fs.mkdirSync(this.getBasePath());
        }
        setInterval(() => {
            this.reloadRobots();
        }, 60*1000);
    }

    public startPier(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.initializeLocalDirectory();
            try {
                this.service = new PierWSClient(this.pierName);

                this.service.connect();

                this.service.addListeners(this);

                return resolve();
            }
            catch(e) {

            }
        });
    }

    public onMessage(msg: IMessage): void {
        if ( typeof msg.targetRobot !== "undefined" && msg.targetRobot !== null) {
            const runner = this.runningRobots.find((r) => r.getRobot().id === msg.targetRobot);
            if (runner) {
                runner.onMessageReceived(msg)
                    .then((res) => {
                        this.service.answer(msg, res);
                    })
                    .catch((e) => {
                        this.service.answer(msg, MessageBuilder.errorRobotMessage(msg.socketId, msg.pierId, e.message));
                    });
                return;
            }


        }
        if (msg.type === MessageTypes.INIT) {
            this.logger.log("Pier initialized received ", msg);
            this.service.send(MessageBuilder.registerMessage(this.pierName));
        }
        else if (msg.type === MessageTypes.REGISTERED) {
            this.service.startHeartbeat();
            this.reloadRobots();
        }
        else if (msg.type === MessageTypes.PIER_DETAILS) {
            this.logger.log("Received pier details ", msg);
        }
        else if (msg.type === MessageTypes.VALIDATE_ROBOT) {
            this.logger.log("Received robot validation request", msg);
            validateRobotShell(msg.responseId, msg.bot).then((res) => {
                this.service.answer(msg, MessageBuilder.validateRobotResponseMessage(msg.socketId, msg.pierId, res));
            })
            .catch((e) => {
                this.service.answer(msg, MessageBuilder.errorRobotMessage(msg.socketId, msg.pierId, e.message));
            });
        }
        else if (msg.type === MessageTypes.RELOAD_ROBOTS) {
            this.reloadRobots();
        }

    }

    reloadRobots() {
        this.service.sendMessageWithResponse(MessageBuilder.getPierDetails())
            .then((res) => {
                this.logger.log("Received pier details ", res);

                this.installRobots(res.piers.robots);
            });
    }

    private installRobots(robots: IRobot[]) {
        for (let robot of robots) {
            try {
                if (this.runningRobots) {
                    const r = this.runningRobots.find((r) => r.getRobot().id === robot.id);
                    if (r) {
                        this.logger.log("Robot already running");
                        r.updateRobot(cleanRobotData(robot));
                    }
                    else {
                        this.logger.log("Installing robot ", robot);
                        const runner : IRobotRunner = new (RobotFactory.generateRobotRunner(robot))(this, robot);
                        this.runningRobots.push(runner);
                        runner.startRobot()
                            .catch((e) => {
                                this.logger.error("Error while starting robot ", robot, e);
                            });
                    }
                }
            }
            catch(e) {
                this.logger.error("Error while installing robot ", robot, e);
            }
        }

    }

    sendMessage(robot: IRobotRunner, robotStopped: IMessage) {
        robotStopped.targetRobot = robot.getRobot().id;
        this.service.send(robotStopped);
    }

    sendMessageWithResponse(msg: IMessage) {
        return this.service.sendMessageWithResponse(msg);
    }
}