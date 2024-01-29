import {IRobot} from "../../models/robot/types";
import * as fs from "fs";
import {IRobotRunner} from "../RobotRunner";
import {LogLevel} from "../../models/other/types";


export default abstract class SourceService {
    private basePath: string = ".robotSources";
    protected targetPath: string = this.basePath;
    private checkInterval: any = null;
    private runner: IRobotRunner;

    constructor(robot: IRobot, runner: IRobotRunner) {
        this.robot = robot;
        this.runner = runner;
    }

    robot: IRobot;

    updateRobot(robot: IRobot) {
        this.onRobotUpdated(robot, this.robot);
        this.robot = robot;

    }

    onRobotUpdated(robot: IRobot, oldRobot: IRobot) {

    }


    abstract downloadSource(): Promise<void>;

    checkForUpdates() {
        return new Promise(() => {
            const updateVersions = async () => {
                const sourceVersion = await this.getSourceVersion();
                const localVersion = await this.getLocalVersion();

                const currentRobot = this.robot;
                if (currentRobot) {
                    if (!currentRobot.sourceInfo) {
                        currentRobot.sourceInfo = {
                            sourceVersion: null,
                            localVersion: null,
                        }
                    }
                    if (currentRobot.sourceInfo.sourceVersion !== sourceVersion) {
                        this.runner.log(LogLevel.UPDATE_AVAILABLE, "Source updated from " + currentRobot.sourceInfo.sourceVersion + " to " + sourceVersion);
                        currentRobot.sourceInfo.sourceVersion = sourceVersion;
                        await this.runner.saveRobot(currentRobot.id, {
                            sourceInfo: currentRobot.sourceInfo
                        });
                    }
                    if (currentRobot.sourceInfo.localVersion !== localVersion) {
                        currentRobot.sourceInfo.localVersion = localVersion;

                        await this.runner.saveRobot(currentRobot.id, {
                            sourceInfo: currentRobot.sourceInfo
                        });
                    }
                }

            }
            clearInterval(this.checkInterval);
            this.checkInterval = setInterval(async () => {
                await updateVersions();
            }, 60*10*1000);
            updateVersions();
        });
    }

    downloadSourceAndCheckForUpdates() {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await this.downloadSource();
                this.checkForUpdates();
                resolve();
            }
            catch(e) {
                reject(e);
            }
        });
    }

    async initialize() {
        return new Promise<void>(async (resolve, reject) => {
            try {
                if (this.robot.enabled) {
                    if (!fs.existsSync(this.basePath)) {
                        fs.mkdirSync(this.basePath);
                    }
                    this.targetPath = this.basePath + "/" + this.robot.id.toString();
                    if (!fs.existsSync(this.targetPath)) {
                        fs.mkdirSync(this.targetPath);
                        this.onDirectoryCreated(this.targetPath);
                    }

                    if (!await this.isSourceAvailable()) {
                        return resolve(await this.downloadSourceAndCheckForUpdates());
                    }

                    this.checkForUpdates();
                }

                return resolve();
            }
            catch(e) {
                reject(e);
            }
        });
    }

    protected onDirectoryCreated(targetPath: string) {

    }

    abstract isSourceAvailable() : Promise<boolean>;

    abstract getSourceVersion() : Promise<string>;
    abstract getLocalVersion() : Promise<string>;
}