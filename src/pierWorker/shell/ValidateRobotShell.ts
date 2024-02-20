import {ShellError} from "../../errors/ShellError";
import {DetectedRunner, IRoboShellValidationResult} from "../../models/harbor/types";
import {evaluateCorrectRunner} from "./evaluateCorrectRunner";
import {IRobot} from "../../models/robot/types";
import GitSourceService from "../source/GitSourceService";

const fs = require('fs');
const os = require('os');
const shell = require('shelljs');

export async function validateRobotShell(taskId: string, bot: IRobot) : Promise<IRoboShellValidationResult> {
  return new Promise<IRoboShellValidationResult>(async (resolve, reject) => {
    try {
        // Create a test directory and cd into it
        const testDir = os.tmpdir() + "/roboharbor-test-"+taskId;

        const clean = async () => {

            // Remove the test directory
            try {

                await shell.rm("-rf", testDir);
            }
            catch(e) {

            }
        }

        fs.mkdirSync(testDir+"/", { recursive: true });
        if (bot.source && bot.source.type == "git") {
            GitSourceService.git_clone(bot.source, testDir)
                .then( async () => {


                        // Check if the directory exists
                        if (!shell.test("-d", testDir)) {
                            reject(new ShellError("Directory does not exist", {
                                shell: "validateRobotShell",
                                bot: bot
                            }));
                        }

                        // Check if more than one directory exists
                        const dirs = shell.ls(testDir);
                        if (dirs.length < 1) {
                            reject(new ShellError("Nothing was in the repository", {
                                shell: "validateRobotShell",
                                bot: bot
                            }));
                        }

                        const ret = {
                            source: true,
                        } as IRoboShellValidationResult;

                        try {
                            const possibleRunners = await evaluateCorrectRunner(testDir);

                            if (possibleRunners) {
                                ret.possibleRunners = possibleRunners;
                            }
                        }
                        catch(e) {

                        }

                        clean();
                        return resolve(ret);
                })
                .catch((e) => {
                    reject(new ShellError(e.message, {
                        shell: "validateRobotShell",
                        bot: bot
                    }));
                });
        }


    }
    catch(e) {
        reject(new ShellError(e.message, {
            shell: "validateRobotShell",
            bot: bot
        }));
    }
  });
}