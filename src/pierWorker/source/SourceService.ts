import {IRobot, ISourceInfo} from "../../models/robot/types";
import * as fs from "fs";
import {IRobotRunner} from "../runner/RobotRunner";
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

    protected getFullTargetPath() {
        // return absolute path
        return process.cwd() + "/" + this.targetPath + "/" + this.robot.id.toString();
    }

    abstract downloadSource(): Promise<void>;

    checkForUpdates() {
        return new Promise(() => {
            try {
                const updateVersions = async () => {
                    try {
                        const {sourceVersion, sourceMessage} = await this.getSourceVersion();
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
                                currentRobot.sourceInfo.sourceMessage = sourceMessage;
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
                    catch(e) {
                        console.error("Error checking for updates: ", e);
                    }

                }
                clearInterval(this.checkInterval);
                this.checkInterval = setInterval(async () => {
                    await updateVersions();
                }, 60*10*1000);
                updateVersions();
            }
            catch(e) {
                console.error("Error checking for updates: ", e);
            }

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
                if (!fs.existsSync(this.basePath)) {
                    fs.mkdirSync(this.basePath);
                }
                if (!fs.existsSync(this.getFullTargetPath())) {
                    fs.mkdirSync(this.getFullTargetPath());
                    this.onDirectoryCreated(this.getFullTargetPath());
                }

                if (!await this.isSourceAvailable()) {
                    return resolve(await this.downloadSourceAndCheckForUpdates());
                }

                this.checkForUpdates();

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

    abstract getSourceVersion() : Promise<{
        sourceVersion: string;
        sourceMessage: string;
    }>;

    abstract getLocalVersion() : Promise<string>;

    abstract reloadVersions(): Promise<ISourceInfo>

    abstract updateSource(): Promise<ISourceInfo>;
}