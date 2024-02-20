import {RobotRunner} from "./RobotRunner";
import ShellRobotRunner from "./ShellRobotRunner";
import {LogLevel} from "../../models/other/types";
import * as fs from "fs";

export default class PythonRobotRunner extends ShellRobotRunner {



    getRobotCommand(): string {
        return 'python3 -u ' +this.robot?.runner?.config?.attributes?.script;
    }

    async runShell(): Promise<{ success: boolean }> {
        return new Promise<{ success: boolean }>(async (resolve, reject) => {
            try {

                if (this.fileExists("requirements.txt")) {
                    await this.runShellCommand("pip3 install -r requirements.txt", (data) => {
                            this.log(LogLevel.INFO, data);
                        }, (data) => {
                            this.log(LogLevel.ERROR, data);
                        },
                        (code) => {
                            if (code !== 0) {
                                this.log(LogLevel.ERROR, "pip3 install -r requirements.txt failed");
                            }
                        });
                }


                return super.runShell().then((result) => {
                    resolve(result);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }

    getName(): string {
        return "PythonRobotRunner";
    }

    private fileExists(txt: string) {
        return fs.existsSync(this.getFullTargetPath() + "/" + txt);
    }
}