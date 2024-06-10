import {Inject, Injectable, Logger} from '@nestjs/common';
import {Socket} from 'socket.io';
import {FollowRobotLogMessage, fromJSON, toJSON, UIWSMessage} from "../../client/src/models/log/types";
import {ICallback, ICallbackLogEntry, ILog, KubernetesLogService, LogType} from "../piers/kubernetes.log.service";
import {Robot} from "../db/robot";
import {InjectModel} from "@nestjs/sequelize";

@Injectable()
export class LogWSService implements ICallback {
    private readonly logger = new Logger(LogWSService.name);
    public static readonly connectedClients: Map<Socket, any> = new Map<Socket, any>();

    constructor(
        @Inject(KubernetesLogService)
        private kubernetesLogService: KubernetesLogService,
        @InjectModel(Robot)
        private robotModel: typeof Robot,
    )  {
    }

    handleDisconnect(socket: any, server: any) {

        const info = LogWSService.connectedClients.get(socket);
        if (info && info.followLogs) {
            info.followLogs.forEach((key) => {
                this.kubernetesLogService.stopFollowLogOfPod(key.toString(), this);
            });
        }
        LogWSService.connectedClients.delete(socket);

    }

    handleConnection(socket: any, server: any) {
        this.logger.debug('Client connected to log websocket');
        LogWSService.connectedClients.set(socket, {});

        const removeDuplicates = (param: any[]) => {
            return param.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
        }

        // Handle other events and messages from the client
        socket.on('message', async (message: any) => {
            try {
                const msg : UIWSMessage = fromJSON(message.toString());
                if (msg.type === FollowRobotLogMessage.getType()) {
                    const followRobotLogMessage = msg as FollowRobotLogMessage;
                    const oldLogs = LogWSService.connectedClients.get(socket).followLogs || [];
                    const newlogs = removeDuplicates([...oldLogs, followRobotLogMessage.robotId]);
                    LogWSService.connectedClients.set(socket, {
                        followLogs: newlogs
                    });
                    const robot  = await this.robotModel.findOne({
                        where: {
                            id: followRobotLogMessage.robotId
                        }
                    });

                    const key = followRobotLogMessage.robotId.toString();

                    this.logger.log(`Following logs for robot ${robot.identifier} with key ${key}`);
                    this.kubernetesLogService.followLog(
                        robot.type == "forever" ? LogType.DEPLOYMENT : LogType.JOB,
                        "default",
                        robot.identifier,
                        key,
                        this,
                    )
                }
            }
            catch(e) {

            }

        });
    }

    onLog(log: ICallbackLogEntry, key: string) {
        if (LogWSService.connectedClients.entries()) {
            const clients = [...LogWSService.connectedClients.entries()].filter(([socket, client]) => {
                return client.followLogs && client.followLogs.includes(parseInt(key));
            }).map(([socket, client]) => {
                return socket;
            });

            clients.forEach((client) => {
                client.send(toJSON({
                    level: 'log',
                    pod: log.pod,
                    date: log.timestamp,
                    logs: log.message
                }));
            });
        }
    }

    onError(err: ICallbackLogEntry, key: string) {
        if (LogWSService.connectedClients.entries()) {
            const clients = [...LogWSService.connectedClients.entries()].filter(([socket, client]) => {
                return client.followLogs && client.followLogs.includes(parseInt(key));
            }).map(([socket, client]) => {
                return socket;
            });

            clients.forEach((client) => {
                client.send(toJSON({
                    level: 'error',
                    pod: err.pod,
                    date: err.timestamp,
                    logs: err.message
                }));
            });
        }
    }

    onLogMessageReceived(targetRobot: number, level: any, logs: any, date: Date) {
        if (LogWSService.connectedClients.entries()) {

            const clients = [...LogWSService.connectedClients.entries()].filter(([socket, client]) => {
                return client.followLogs && client.followLogs.includes(targetRobot);
            }).map(([socket, client]) => {
                return socket;
            });

            clients.forEach((client) => {
                client.send(toJSON({
                    type: 'log',
                    level: level,
                    date: date,
                    logs: logs
                }));
            });
        }
    }

    private onNewClientFollowsLogs(socket: any) {
        // Get the last 30 log entries for the specified robot
        // Send them to the client
        const info = LogWSService.connectedClients.get(socket);

    }
}