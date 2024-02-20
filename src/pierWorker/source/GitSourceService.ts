import SourceService from "./SourceService";
import * as fs from "fs";
import {ShellError} from "../../errors/ShellError";
import {ISourceInfo} from "../../models/robot/types";

const os = require('os');
const shell = require('shelljs');

export default class GitSourceService extends SourceService {

    static git_run(git_command: string, source: any, targetPath: string, callback?: (code: number, stdout: string, stderr: string) => Promise<void>) {
        return new Promise<void>(async (resolve, reject) => {
            try {

                const keyFile = os.tmpdir()+"/"+new Date().getTime()+"mykey.ssh"
                const clean = async () => {
                    try {
                        await shell.rm("-rf", keyFile);
                    }
                    catch(e) {

                    }
                }

                // Run the shell command
                let sshauthentication = "";

                if (source.credentials) {
                    if (source.credentials?.sshKey) {
                        // write mykey.ssh
                        await fs.writeFileSync(keyFile, source.credentials.sshKey, {encoding: "utf8", mode: 0o600});
                    }
                    else if (source.credentials?.username && source.credentials?.password) {
                        sshauthentication = source.credentials.username+":"+source.credentials.password+"@";
                    }
                }


                const initializeSshKey = source.credentials && source.credentials.sshKey  ? "ssh-add "+keyFile+";  " : "";

                const shell_command = "ssh-agent bash -c '"+initializeSshKey+" GIT_SSH_COMMAND=\"ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no\" "+git_command+"'"
                // Run a git checkout command in local shell
                const l = shell.exec(shell_command, {silent: true,
                                                     cwd: targetPath},
                    async (code, stdout, stderr) => {
                        try {

                            if (code !== 0) {
                                clean();
                                reject(new ShellError(stderr, {
                                    command: git_command,
                                }));
                            }
                            else {
                                if (callback) {
                                    try {
                                        await callback(code, stdout, stderr);
                                    }
                                    catch(e) {
                                        reject(e);
                                    }

                                }
                                resolve();
                            }
                        }
                        catch(e) {
                            reject(e);
                        }
                    })
                l.on("data", async (d: any) => {
                    clean();
                });
                l.on("close", async (d: any) => {
                    clean();
                });
                l.stderr.on("error", async (d: any) => {
                    clean();
                });
                await l;
            }
            catch(e) {
                reject(e);
            }
        });
    }

    static git_clone(source: any, targetPath: string) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const keyFile = os.tmpdir() + "/" + new Date().getTime() + "mykey.ssh"
                const clean = async () => {
                    try {
                        await shell.rm("-rf", keyFile);
                    } catch (e) {

                    }
                }

                // Run the shell command
                let sshauthentication = "";

                if (source.credentials) {
                    if (source.credentials?.sshKey) {
                        // write mykey.ssh
                        await fs.writeFileSync(keyFile, source.credentials.sshKey, {encoding: "utf8", mode: 0o600});
                    } else if (source.credentials?.username && source.credentials?.password) {
                        sshauthentication = source.credentials.username + ":" + source.credentials.password + "@";
                    }
                }

                const expanduser = (path: string) => {
                    if (sshauthentication != "") {
                        const removed = path.split("@")[path.split("@").length - 1];
                        return sshauthentication + removed;
                    }
                    return path;
                }
                return this.git_run("git clone " + expanduser(source.url) + " " + targetPath, source, targetPath)
                    .then(() => {
                        resolve();
                    })
                    .catch((e) => {
                        reject(e);
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    async downloadSource(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                return GitSourceService.git_clone(this.robot.source, this.getFullTargetPath())
                    .then(() => {
                        resolve();
                    })
                    .catch((e) => {
                        reject(e);
                    });
            }
            catch(e) {
                reject(e);
            }
        });
    }


    getSourceVersion(): Promise<{
        sourceVersion: string;
        sourceMessage: string;
    }> {
        return new Promise<{
            sourceVersion: string;
            sourceMessage: string;
        }>(async (resolve, reject) => {
            try {
                if (await this.isSourceAvailable()) {
                    await GitSourceService.git_run("git fetch ", this.robot.source, this.getFullTargetPath())
                    await GitSourceService.git_run("git log origin/"+this.robot.source.branch+" -1", this.robot.source, this.getFullTargetPath(),
                        (code: number, stdout: string, stderr: string) => {
                        if (code !== 0) {
                            reject(stderr);
                        }
                        else {
                            resolve({
                                sourceVersion: stdout.trim().split("\n")[0].split(" ")[1].trim(),
                                sourceMessage: stdout
                            });
                        }
                        return Promise.resolve();
                    });
                }
                return resolve({
                    sourceVersion: null,
                    sourceMessage: null
                })
            }
            catch(e) {
                reject(e);
            }
        });
    }

    isSourceAvailable(): Promise<boolean> {
        // check if .git exists
        // if not, return empty string
        if (!fs.existsSync(this.getFullTargetPath() + "/.git")) {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }

    reloadVersions(): Promise<ISourceInfo> {
        return new Promise<ISourceInfo>(async (resolve, reject) => {
            try {
                const {sourceVersion, sourceMessage} = await this.getSourceVersion();
                const localVersion = await this.getLocalVersion();
                resolve({
                    sourceVersion: sourceVersion,
                    sourceMessage: sourceMessage,
                    localVersion: localVersion
                });
            }
            catch(e) {
                reject(e);
            }
        });
    }

    getLocalVersion(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                return GitSourceService.git_run("git rev-parse HEAD", this.robot.source, this.getFullTargetPath(), async (code, stdout, stderr) => {
                    if (code !== 0) {
                        reject(stderr);
                    }
                    else {
                        resolve(stdout.trim().split("\n")[0]);
                    }
                    return Promise.resolve();
                });
            }
            catch(e) {
                reject(e);
            }
        });
    }

    updateSource(): Promise<ISourceInfo> {
        return new Promise<ISourceInfo>(async (resolve, reject) => {
            try {
                await GitSourceService.git_run("git pull", this.robot.source, this.getFullTargetPath(),
                    async (code, stdout, stderr) => {
                    if (code !== 0) {
                        reject(stderr);
                    }
                    else {
                        resolve(await this.reloadVersions());
                    }
                });
            }
            catch(e) {
                reject(e);
            }
        });
    }
}