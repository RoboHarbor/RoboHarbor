import {ShellError} from "../../errors/ShellError";
import {DetectedRunner, IRoboShellValidationResult} from "../../models/harbor/types";
import {evaluateCorrectRunner} from "./evaluateCorrectRunner";

const os = require('os');
const shell = require('shelljs');

export async function validateRobotShell(taskId: string, bot: any) : Promise<IRoboShellValidationResult> {
  return new Promise<IRoboShellValidationResult>(async (resolve, reject) => {
    try {
        // Create a test directory and cd into it
        const testDir = os.tmpdir() + "/roboharbor-test-"+taskId;
        shell.mkdir(testDir);

        // Run the shell command
        if (bot.source && bot.source.type == "git") {
            // Run a git checkout command in local shell
            await shell.exec("git clone "+bot.source.url+" "+testDir, {silent: false}, async (code, stdout, stderr) => {
                if (code !== 0) {
                    reject(new ShellError(stderr, {
                        shell: "validateRobotShell",
                        bot: bot
                    }));
                }
                else {

                    // Check if the directory exists
                    if (!shell.test("-d", testDir)) {
                        reject(new ShellError("Directory does not exist", {
                            shell: "validateRobotShell",
                            bot: bot
                        }));
                    }

                    // Check if more than one directory exists
                    const dirs = shell.ls(testDir);
                    if (dirs.length <= 1) {
                        reject(new ShellError("More than one directory exists", {
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

                    return resolve(ret);
                }
            });
        }

        // Remove the test directory
        try {

            await shell.rm("-rf", testDir);
        }
        catch(e) {

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