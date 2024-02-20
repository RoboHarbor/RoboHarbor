import {RobotRunner} from "./RobotRunner";
import {MessageBuilder} from "../../harbor/socket.service";
import {LogLevel} from "../../models/other/types";
import * as child_process from "node:child_process";
import fs from "fs";
import {WebSocket, WebSocketServer } from 'ws';
const shell = require('shelljs');

export default class ShellRobotRunner extends RobotRunner {

    protected myShellScript: any = null;

    isRunning(): boolean {
        return this.myShellScript !== null;
    }

    getRobotCommand(): string {
        return this.robot?.runner?.config?.attributes?.command;
    }

    runShellCommand(command: string, log: (l: string) => void, error: (e: string) => void, onExit: (code: number) => void) : Promise<{
        success: boolean,
    }> {
        return new Promise<{
            success: boolean,
        }>((resolve, reject) => {
            try {

                let errored = false;

                const child = shell.exec(command, {
                    cwd: this.getFullTargetPath(),
                    async: true,
                    silent: true
                });

                child.stdout.on('data', (data)=>{
                    log(data.toString());
                });
                child.stderr.on('data', (data)=>{
                    errored = true;
                    error(data.toString());

                });
                child.on('exit', (code)=>{
                    onExit(code);
                    return resolve({
                        success: code === 0,
                    })
                });

            }
            catch (e) {
                reject(e);
            }
        });
    }


    async runShell() : Promise<{
        success: boolean,
    }> {
        return new Promise<{
            success: boolean,
        }>(async (resolve, reject) => {
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

                // read the file ".roboport" to get the port number
                let port = this.readPortFile();

                if (port) {
                    if (await this.checkForOpenPort(port) === false) {
                        port = null;
                    }
                }

                if (!port) {
                    const d = child_process.spawn("/bin/bash", ["-ic", "forked_proc_socket '"+robotCOmmand+"' &","disown"], {
                        cwd: this.getFullTargetPath(),
                        detached: true,
                        stdio: ['ignore', 'ignore', 'ignore']
                    });
                    d.unref();
                }

                // wait for 2 seconds until process started and then read
                // the file ".roboport" to get the port number
                await new Promise((resolve) => {    setTimeout(resolve, 2000); });

                port = this.readPortFile();

                if (!port) {
                    this.logger.log("No port found for robot: " + this.robot.name);
                    return this.onErrorStop("No port found for robot: " + this.robot.name)
                        .then(() => {
                            resolve({
                                success: false
                            });
                        })
                }

                this.myShellScript = this.connectToWebsocket(port,
                    (log: string) => {
                        this.log(LogLevel.INFO, log);
                    },
                    (log: string) => {
                        this.log(LogLevel.ERROR, log);
                    });



                /*
                this.myShellScript.stdout.on('data', (data)=>{
                    this.log(LogLevel.INFO, data.toString());
                    // do whatever you want here with data
                });
                this.myShellScript.stderr.on('data', (data)=>{
                    errored = true;
                    this.log(LogLevel.ERROR, data);

                });*/

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

    installDependencies() {
        return new Promise<void>((resolve, reject) => {
            return this.runShellCommand("npm -g install forked_proc_socket --force", (data) => {
                }, (data) => {
                },
                (code) => {
                   return resolve();
                })
                .catch(()=>
                    resolve());
        });
    }

    async initialStart(): Promise<any> {
        this.stopCalled = false;
        await this.installDependencies();
        if (this.isForever() && this.isEnabled() && !this.isRunning()) {
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
                try {

                    await this.myShellScript.kill();
                }
                catch(e) {
                    this.logger.error(e);
                }
                this.myShellScript = null;
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

    private async checkForOpenPort(port: string) {
        return new Promise<boolean>((resolve, reject) => {
            const net = require('net');
            const server = net.createServer();
            server.once('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    return resolve(true);
                }
                return resolve(true);
            });
            server.once('listening', () => {
                server.close();
                resolve(false);
            });
            server.listen(port);
        });
    }

    private connectToWebsocket(port: string, param2: (log: string) => void, param3: (log: string) => void) {
        const ws = new WebSocket('ws://localhost:' + port);
        const _this = this;
        ws.on('open', function (event) {
            param2('Connected to websocket');
        });
        ws.on('message', function (event) {
            try {

                const json = JSON.parse(event.toString());
                if (json.type === "stdout") {
                    _this.log(LogLevel.INFO, json.data);
                }
                else if (json.type === "stderr") {
                    _this.log(LogLevel.ERROR, json.data);
                }
            }
            catch(e) {}
        });
        ws.on('error', function (event) {
            param3(event.toString());
        });
        ws.on('close', function (event) {
            _this.onExit(0);
        });

        return {
            kill: async () => {
                this.logger.log("Closing websocket");
                await new Promise<void>((res) => {
                    ws.send(JSON.stringify({
                        command: "exit"
                    }), (err: any) => {
                        if (err) {
                            this.logger.error(err);
                        }
                        res();
                    });
                })
                await new Promise((resolve) => {    setTimeout(resolve, 2000); });
                ws.close();
            },
            close: async () => {
                this.logger.log("Closing websocket");
                ws.send(JSON.stringify({
                    command: "exit"
                }));
                await new Promise((resolve) => {    setTimeout(resolve, 2000); });
                ws.close();
            }
        }
    }
}