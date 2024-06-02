import {Injectable, Logger} from '@nestjs/common';
import { Socket } from 'socket.io';
import {FollowRobotLogMessage, fromJSON, toJSON, UIWSMessage} from "../../client/src/models/log/types";
import {Log} from "../db/log.model";
import {Op} from "sequelize";

@Injectable()
export class LogWSService {
    private readonly logger = new Logger(LogWSService.name);
    public static readonly connectedClients: Map<Socket, any> = new Map<Socket, any>();

    constructor()  {
    }

    handleDisconnect(socket: any, server: any) {

        LogWSService.connectedClients.delete(socket);
    }

    handleConnection(socket: any, server: any) {

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
                    this.onNewClientFollowsLogs(socket);
                }
            }
            catch(e) {

            }

        });
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
        if (info && info.followLogs) {
            const logs = [];
            for (let robotId of info.followLogs) {
                Log.findAll({
                    where: {
                        robotId: robotId,
                        // Where date not null
                        date: {
                            [Op.ne]: null
                        }
                    },
                    order: [
                        ['date', 'DESC']
                    ],
                    limit: 30
                }).then((res) => {
                    for (let log of res.reverse()) {
                        socket.send(toJSON({
                            type: 'log',
                            level: log.level,
                            date: log.date,
                            logs: log.logs
                        }));
                    }
                });
            }
        }
    }
}