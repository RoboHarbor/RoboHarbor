import {RobotRunner} from "../RobotRunner";
import {MessageBuilder} from "../../harbor/socket.service";
import {LogLevel} from "../../models/other/types";

const exec = require('child_process').exec;

export default class ShellRobotRunner extends RobotRunner {

    protected myShellScript: any = null;

    isRunning(): boolean {
        return this.myShellScript !== null;
    }

    getRobotCommand(): string {
        return this.robot?.runner?.config?.attributes?.command;
    }

    async runShell() : Promise<{
        success: boolean,
    }> {
        return new Promise<{
            success: boolean,
        }>((resolve, reject) => {
            try {

                const robotCOmmand = this.getRobotCommand();

                if (!robotCOmmand) {
                    this.logger.log("No command found for robot: " + this.robot.name);
                    return this.onErrorStop("No command found for robot: " + this.robot.name)
                        .then(() => {
                            resolve({
                                success: false
                            });
                        })
                }

                let errored = false;
                this.myShellScript = exec(robotCOmmand);
                this.myShellScript.stdout.on('data', (data)=>{
                    this.log(LogLevel.INFO, data);
                    // do whatever you want here with data
                });
                this.myShellScript.stderr.on('data', (data)=>{
                    errored = true;
                    this.log(LogLevel.ERROR, data);

                });
                this.myShellScript.on('exit', (code)=>{
                    setTimeout(() => {
                        if (!this.stopCalled) {
                            this.crashed(code);

                        }
                        else {
                            this.stoppedManually();
                        }
                        this.myShellScript = null;

                        this.logger.log("Shell script exited with code: " + code);
                        this.onExit(code);
                    }, 400);

                });

                resolve({
                    success: true,
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }

    getName(): string {
        return "ShellRobotRunner";
    }

    onExit(code: number) {
        this.myShellScript = null;
        super.onExit(code);
    }

    async triggerManualRun(): Promise<{ success: boolean }> {
        if (this.isEnabled()) {
            this.runShell();
            return Promise.resolve({
                success: true,
            });
        }
        else {
            return Promise.resolve({
                success: false,
            });
        }
    }

    async initialStart(): Promise<any> {
        this.stopCalled = false;
        if (this.isForever() && this.isEnabled()) {
            this.logger.log("Starting robot: " + this.robot.name);

            this.runShell();

        }


    }

    async stop(): Promise<{
        success: boolean,
    }> {
            if (this.myShellScript) {
                this.stopCalled = true;
                this.logger.log("Stopping robot: " + this.robot.name);
                this.myShellScript.kill();
            }
            return Promise.resolve({
                success: true,
            });
    }

    private onErrorStop(s: string) {
        this.logger.error(s);
        this.service.sendMessage(this, MessageBuilder.robotStopped(this.robot));
        return this.stop();
    }

}