import PierWorkerService from "../PierWorkerService";
import {IRobot} from "../../models/robot/types";
import {Logger} from "@nestjs/common";
import {IMessage, MessageBuilder, MessageTypes} from "../../harbor/socket.service";
import RobotFactory from "../RoboFactory";
import SourceService from "../source/SourceService";
import SourceFactory from "../source/SourceFactory";
import {LogLevel} from "../../models/other/types";
import * as fs from "fs";

export interface IRobotRunner {

    getRobot(): IRobot;

    log(level: LogLevel, data: string);

    initialStart(): Promise<{
        success: boolean,
    }>;

    triggerManualRun(): Promise<{
        success: boolean,
    }>;

    stop(): Promise<{
        success: boolean,
    }>;

    onMessageReceived(msg: IMessage): Promise<any>;

    startRobot(): Promise<any>;

    updateRobot(robot: IRobot): Promise<void>;

    saveRobot(robotId: number, fieldsToUpdate: any): Promise<IRobot>;
}

export abstract class RobotRunner implements IRobotRunner {
    protected stopCalled: boolean;
    protected robot: IRobot;
    protected lastRestart: Date = null;
    protected readonly logger = null;
    protected service: PierWorkerService;
    private restartTimer: any;
    private sourceService: SourceService;
    private logTimeout: any = null;
    private lastSendLog: number;
    private loggedData: string[] = [];

    constructor(service: PierWorkerService, robot: IRobot) {
        this.service = service;
        this.robot = robot;
        this.logger = new Logger(this.getName()+"-"+robot.name);
    }

    abstract getName(): string;

    isForever(): boolean {
        return this.robot.type === 'forever';
    }

    isEnabled(): boolean {
        return this.robot.enabled === true;
    }

    onBeforeRobotUpdated(robot: IRobot) {

    }

    getFullTargetPath() {
        return process.cwd() + "/.robotSources/" + this.robot.id.toString();
    }

    onRobotUpdated(robot: IRobot) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                if (this.sourceService) {
                    this.sourceService.checkForUpdates();
                }
                return resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    abstract isRunning(): boolean ;

    async updateRobot(robot: IRobot) {
        await this.onBeforeRobotUpdated(robot);
        this.robot = robot;
        await this.sourceService.updateRobot(robot);
        await this.onRobotUpdated(robot);
    }

    async onMessageReceived(message: IMessage) {
        try {
            this.logger.log("onMessageReceived: " + JSON.stringify(message));

            await this.updateRobot(message.robot);
            if (message.type === MessageTypes.ROBOT_MANUAL_RUN) {
                return this.triggerManualRun();
            }
            else if (message.type === MessageTypes.ROBOT_STOP) {
                if (!this.isRunning()) {
                    return Promise.resolve({
                        success: false,
                    });
                }
                return this.stop();
            }
            else if (message.type === MessageTypes.RUN_ROBOT) {
                if (this.isRunning()) {
                    return Promise.resolve({
                        success: false,
                    });
                }
                return this.startRobot();
            }
            else if (message.type === MessageTypes.RELOAD_ROBOT_SOURCE) {
                return this.sourceService.reloadVersions()
                    .then((sourceInfo: any) => {
                        return {
                            success: true,
                            sourceInfo: sourceInfo,
                        };
                    })
                    .catch((e) => {
                        return Promise.reject(e);
                    });
            }
            else if (message.type === MessageTypes.UPDATE_ROBOT_SOURCE) {
                return this.sourceService.updateSource()
                    .then((sourceInfo: any) => {
                        return {
                            success: true,
                            sourceInfo: sourceInfo,
                        };
                    })
                    .catch((e) => {
                        return Promise.reject(e);
                    });
            }
            else {
                return Promise.resolve({
                    success: false,

                });
            }
        }
        catch(e) {
            return Promise.reject(e);
        }


    }

    getRobot(): IRobot {
        return this.robot;
    }



    abstract triggerManualRun(): Promise<{
        success: boolean,
    }> ;

    async initialStart(): Promise<{
        success: boolean,
    }> {
        setTimeout(() => {

            if (this.isForever() && this.isEnabled()) {
                this.logger.log("Starting robot: " + this.robot.name);
            }


        }, 1);
        return Promise.resolve({
            success: true,
        });
    }

    async stop(): Promise<{
        success: boolean,
    }> {
        clearTimeout(this.restartTimer);
        return Promise.resolve({
            success: true,
        });
    }

    async restart(): Promise<any> {
        if (this.lastRestart !== null && (new Date().getTime() - this.lastRestart.getTime()) < 10000) {
            this.logger.log("Restarting robot: " + this.robot.name + " failed, too fast");
            this.restartTimer = setTimeout(() => {
                this.restart();
            }, 10000);
            return;
        }
        this.logger.log("Restarting robot: " + this.robot.name);
        this.lastRestart = new Date();
        this.stopCalled = true;
        await this.stop();
        await this.startRobot();
        return Promise.resolve({
            success: true,
        });
    }

    startRobot(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                await this.initializeSource();
                return resolve(await this.initialStart());
            }
            catch (e) {
                return reject(e);
            }
        });
    }

    public log(level: LogLevel, data: string) {
        this.logger.log(data);
        this.loggedData.push(data);

        const sendLogMessages = () => {
            this.service.sendMessage(this, MessageBuilder.robotLog(this.robot, level, this.loggedData.join("\n")));
            this.lastSendLog = new Date().getTime();
            this.loggedData = [];
        }
        if (!this.lastSendLog || (this.lastSendLog && (new Date().getTime() - this.lastSendLog) > 2000)) {
            sendLogMessages();
            this.lastSendLog = new Date().getTime();
        }

    }

    protected crashed(code) {
        this.service.sendMessage(this, MessageBuilder.robotCrashed(this.robot, code));
        this.service.sendMessage(this, MessageBuilder.robotLog(this.robot, LogLevel.CRASH, "Robot crashed"));
    }

    protected stoppedManually() {
        this.service.sendMessage(this, MessageBuilder.robotStopped(this.robot));
        this.service.sendMessage(this, MessageBuilder.robotLog(this.robot, LogLevel.STOPPED, "Robot stopped manually"));
    }

    onExit(code: number) {
        if (this.isForever() && this.isEnabled()) {
            this.restart();
        }
    }

    readPortFile() {
        try {
            const portFile = this.getFullTargetPath() + "/.roboport";
            if (fs.existsSync(portFile)) {
                const dataJSON = fs.readFileSync(portFile, 'utf8');
                const data = JSON.parse(dataJSON);
                return data.port;
            }
        }
        catch(e) {

        }
        return null;
    }

    private async initializeSource() {
        return new Promise<void>(async (resolve, reject) => {
            try {
                this.logger.log("Initializing source for robot: " + this.robot.name);
                this.sourceService = SourceFactory.generateSourceService(this, this.robot);
                await this.sourceService.initialize();
                return resolve();
            }
            catch (e) {
                reject(e);
            }
        });
    }


    saveRobot(robotId: number, fieldsToUpdate: any): Promise<IRobot> {
        return new Promise<IRobot>(async (resolve, reject) => {
            try {
                const msg = await this.service.sendMessageWithResponse(MessageBuilder.updateRobot(robotId, fieldsToUpdate));
                return resolve(msg.robot);
            }
            catch (e) {
                reject(e);
            }
        });
    }
}