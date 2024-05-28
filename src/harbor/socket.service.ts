import {forwardRef, Inject, Injectable, Logger} from '@nestjs/common';
import { Socket } from 'socket.io';
import {NoPierAvailableError} from "../errors/NoPierAvailableError";
import {SendWebSocketMessageError} from "../errors/SendWebSocketMessageError";
import {RobotsService} from "../robots/robots.service";
import {InjectModel} from "@nestjs/sequelize";
import {Robot} from "../db/robot";
import {IRobot} from "../models/robot/types";
import {LogLevel} from "../models/other/types";
import {LogWSService} from "../log/logws.service";
import {cleanRobotData} from "../helper/robo";

const WAIT_FOR_REGISTRATION = 5000;

export interface IMessage {
    type: string,
    robot?: any,
    targetRobot?: number,
    socketId?: string,
    responseId?: string,
    isResponse?: boolean,
    waitForResponse?: boolean,
    isError?: boolean,
    [key: string]: any
}

export enum MessageTypes {
    INIT = "initMessage",
    VALIDATE_ROBOT = "validateRobotDetails",
    VALIDATE_ROBOT_RESPONSE = "validateRobotResponse",
    NO_REGISTRATION = "noRegistrationMessage",
    PROTOCOL_MISMATCH = "protocolMismatch",
    ROBOT_MANUAL_RUN = "robotManualRun",
    REGISTER_ROBOT = "REGISTER_ROBOT",
    PING = "ping",
    REGISTERED = "registered",
    PIER_DETAILS = "pierDetails",
    GET_ROBOT_DETAILS = "getRobotDetails",
    REGISTERED_FAILED = "registeredFailed",
    ROBOT_CREATED = "robotCreated",
    RELOAD_ROBOTS = "reloadRobots",
    RUN_ROBOT = "runRobot",
    ERROR_ROBOT_MESSAGE = "errorRobotMessage",
    ROBOT_STOP = "robotStop",
    ROBOT_STOPPED = "robotStopped",
    ROBOT_LOG = "robotLog",
    ROBOT_CRASHED = "robotCrashed",
    UPDATE_ROBOT = "updateRobot",
    ROBOT_UPDATED = "robotUpdated",
    RELOAD_ROBOT_SOURCE = "reloadRobotSource",
    UPDATE_ROBOT_SOURCE = "updateRobotSource",
    DELETE_ROBOT = "deleteRobot"

}

export class MessageBuilder {
    static toMessage(d: any) {
        return JSON.stringify(d);
    }
    static initMessage() {
        return {
            type: "initMessage",
            description: "Send me a registration message with your client id"
        };
    }

    static fromMessage(message: any) : IMessage {
        return JSON.parse(message) as IMessage;
    }

    static notInitializedMessage() {
        return {
            type:  "noRegistrationMessage",
            description: "Sorry but you have not registered"
        };
    }

    static protocolMismatch(s: string) {
        return {
            type: "protocolMismatch",
            description: "Can not understand your message"
        };
    }

    static registrationSuccess(socketId: string) {
        return {
            type: MessageTypes.REGISTERED,
            success: "true",
            description: "Thanks for registration "+socketId
        };
    }

    static heartbeatMessage() {
        return {
            type: MessageTypes.PING
        };
    }

    static registrationError(socketId: string, s: string) {
        return {
            type: MessageTypes.REGISTERED_FAILED,
            success: "false",
            isError: true,
            error: s,
            description: "Error in registration "+s,
        };
    }

    static validateRobotMessage(bot: any) {
        return {
            type: MessageTypes.VALIDATE_ROBOT,
            robot: cleanRobotData(bot)
        };
    }

    static validateRobotResponseMessage(socketId: string, pierId: any, response: any) {
        return {
            type: MessageTypes.VALIDATE_ROBOT_RESPONSE,
            response: response,
            pierId: pierId
        };
    }

    static createdRobotMessage(pierId: any, bot: any) {
        return {
            type: MessageTypes.ROBOT_CREATED
        };
    }

    static reloadRobots() {
        return {
            type: MessageTypes.RELOAD_ROBOTS
        };
    }

    static runRobotMessage(robot: Robot) {
        return {
            type: MessageTypes.RUN_ROBOT,
            targetRobot: robot.id
        };
    }

    static errorRobotMessage(socketId: string, pierId: any, message) {
        return {
            type: MessageTypes.ERROR_ROBOT_MESSAGE,
            error: message,
            isError: true,
            pierId: pierId
        }
    }

    static stopRobotMessage(robot: Robot) {
        return {
            type: MessageTypes.ROBOT_STOP,

        }
    }

    static robotStopped(robot: IRobot) {
        return {
            type: MessageTypes.ROBOT_STOPPED,
        }
    }

    static robotLog(robot: IRobot, level: LogLevel, data: string) {
        return {
            type: MessageTypes.ROBOT_LOG,
            level: level,
            date: new Date(),
            logs: data
        };
    }

    static robotCrashed(robot: IRobot, code) {
        return {
            type: MessageTypes.ROBOT_CRASHED,
            code: code
        };
    }

    static updateRobot(robotId: number, fieldsToUpdate: any) {
        return {
            type: MessageTypes.UPDATE_ROBOT,
            robotId: robotId,
            fieldsToUpdate: fieldsToUpdate
        };
    }

    static updatedRobotDetails(robot: Robot) {
        return  {
            type: MessageTypes.ROBOT_UPDATED,
            robot: robot,
            targetRobot: robot.id
        }
    }

    static reloadSourceMessage(robot: Robot) {
        return {
            type: MessageTypes.RELOAD_ROBOT_SOURCE,
            targetRobot: robot.id,
        };
    }

    static updateSourceMessage(robot: Robot) {
        return {
            type: MessageTypes.UPDATE_ROBOT_SOURCE,
            targetRobot: robot.id,
        };
    }

    static deleteRobotMessage(robot: Robot) {
        return {
            type: MessageTypes.DELETE_ROBOT,
            targetRobot: robot.id
        };
    }

    static getRobotDetails(robot: Robot) {
        return {
            type: MessageTypes.GET_ROBOT_DETAILS,
            robot: robot
        };
    }
}

interface IMessageResponseInfo {
    resolve: any,
    reject: any,
    sentMessage: IMessage,
    response?: any,
    pierId: string,
    timeout: any
    date: Date
}

@Injectable()
export class SocketService {
    private readonly logger = new Logger(SocketService.name);
    private static readonly connectedClients: Map<string, Socket> = new Map();
    private static readonly connectedRobots: Map<string, Socket[]> = new Map();
    private static messageResponseRegistry: Map<string, IMessageResponseInfo> = new Map();

    constructor(
                private readonly logWsService: LogWSService,
                @Inject(forwardRef(() => RobotsService))
                private robotsService: RobotsService,

                @InjectModel(Robot)
                private robotModel: typeof Robot,)  {
    }

    getSocketId(socket: Socket) {
        let foundValue = null;
        SocketService.connectedClients.forEach((value: Socket, key: any) => {
            if (value === socket) {
                foundValue = key;
            }
        });
        return foundValue;
    }

    getSocketRobotId(socket: Socket) {
        let foundValue = null;
        SocketService.connectedRobots.forEach((value: Socket[], key: any) => {
            for (const s of value) {
                if (s === socket) {
                    foundValue = key;
                }
            }
        });
        return foundValue;
    }

    handleDisconnect(socket: Socket, server: any): void {
        SocketService.connectedClients.delete(this.getSocketId(socket));
        this.logger.debug("Client disconnected",  this.getSocketRobotId(socket));
        const robots = SocketService.connectedRobots.get(this.getSocketRobotId(socket));
        if (robots) {
            this.logger.debug("Robot disconnected", robots);
            const newRobots = robots.filter((value) => {
                return value !== socket;
            });
            if (newRobots.length === 0) {
                this.logger.debug("No more robots connected");
                SocketService.connectedRobots.delete(this.getSocketRobotId(socket));
            }
            else {
                this.logger.debug("Robots disconnected, but some available", newRobots)
                SocketService.connectedRobots.set(this.getSocketRobotId(socket), newRobots);
            }
        }
    }
    
    handleConnection(socket: Socket, server: any): void {

        this.sendMessage(socket, MessageBuilder.initMessage());

        setTimeout(() => {
            let found = false;
            SocketService.connectedClients.forEach((value: Socket, key: any) => {
                if (value === socket) {
                    found = true;
                }
            })
            if (!found) {
                this.sendMessage(socket, MessageBuilder.notInitializedMessage())
                try {
                    // @ts-ignore
                    socket.terminate();
                }
                catch (e) {
                    this.logger.error("Error terminating socket - "+this.getSocketId(socket));
                }
            }
        }, WAIT_FOR_REGISTRATION);

        socket.on('error', (error: any) => {
            this.logger.error("Socket error", error);
        });

        // Handle other events and messages from the client
        socket.on('message', async (message: any) => {
            try {
                const msg = MessageBuilder.fromMessage(message.toString());
                this.logger.debug(msg);
                if (typeof msg.socketId === "undefined" || msg.socketId === null) {
                    msg.socketId = this.getSocketId(socket);
                }
                this.onMessageReceived(socket, msg);
            }
            catch(e) {
                this.sendMessage(socket, MessageBuilder.protocolMismatch(e.toString()));
            }

        });
    }

    answer(socket: Socket, message: IMessage, response: IMessage) {
        response.responseId = message.responseId;
        response.isResponse = true;
        this.sendMessage(socket, response);
    }

    async onMessageReceived(socket: Socket, message: IMessage) {
        try {
            if (message.type === MessageTypes.REGISTER_ROBOT) {
                SocketService.connectedClients.set(message.socketId, socket);
                if (SocketService.connectedRobots.get(message.robotId) === undefined) {
                    SocketService.connectedRobots.set(message.robotId, []);
                }
                SocketService.connectedRobots.get(message.robotId).push(socket);

                setTimeout(async () => {
                    try {

                        this.sendMessage(socket, MessageBuilder.registrationSuccess(message.socketId));
                    }
                    catch(e) {
                        this.sendMessage(socket, MessageBuilder.registrationError(message.socketId, e.toString()));
                    }

                }, 100);

            }
            else if (message.type === MessageTypes.GET_ROBOT_DETAILS) {
                const robot = await this.robotModel.findByPk(message.roboId);
                if (robot) {
                    this.answer(socket, message, MessageBuilder.getRobotDetails(robot));
                }
                else {
                    this.logger.error("Robot not found", message);
                    this.answer(socket, message, MessageBuilder.errorRobotMessage(message.socketId, message.pierId, "Robot not found"));
                }
            }
            else if (message.type === MessageTypes.ROBOT_LOG) {
                const robotId = message.targetRobot;
                this.logWsService.onLogMessageReceived(message.targetRobot, message.level, message.logs, message.date);
                this.robotsService.logRobot(robotId, message.level, message.logs);

            }
            else if (message.type === MessageTypes.UPDATE_ROBOT) {
                const robotId = message.robotId;
                const fieldsToUpdate = message.fieldsToUpdate;
                const robot = await this.robotModel.findByPk(robotId);
                if (robot) {
                    await robot.update(fieldsToUpdate)
                    this.answer(socket, message, MessageBuilder.updatedRobotDetails(robot));
                }
                else {
                    this.logger.error("Robot not found for update", message);
                    this.answer(socket, message, MessageBuilder.errorRobotMessage(message.socketId, message.pierId, "Robot not found for update"));
                }
            }
            else if (message.type === MessageTypes.PING) {
                // Nothing to do
                try {

                }
                catch(e){}
            }
            else if (message.type === MessageTypes.VALIDATE_ROBOT) {

            }
            else if (message.type === MessageTypes.ROBOT_STOPPED) {
                const robot =  await this.robotModel.findByPk(message.targetRobot);
                if (robot) {
                    robot.enabled = false;
                    await robot.save();
                }
            }
            else if (message.isResponse) {
                const responseInfo = SocketService.messageResponseRegistry.get(message.responseId);
                if (responseInfo) {
                    clearTimeout(responseInfo.timeout);
                    SocketService.messageResponseRegistry.delete(message.responseId);
                    responseInfo.resolve(message);
                }
                else {
                    this.logger.error("No response info found for responseId: "+message.responseId, message);
                }
            }
        }
        catch(e) {
            this.logger.error("Error in onMessageReceived", e);
        }

    }

    getBestPier() {
        return SocketService.connectedClients.keys().next().value;
    }

    private randomResponseId() {
        return Math.floor(Math.random() * 1000000000).toString();
    }

    sendMessageWithResponse(id: string, message: IMessage, timeout: number=10) : Promise<IMessage> {
        return new Promise<IMessage>(async (resolve, reject) => {
            if (SocketService.connectedRobots.get(id)) {
                for (const socket of SocketService.connectedRobots.get(id)) {
                    try {
                        message.responseId = this.randomResponseId() ;
                        message.waitForResponse = true;
                        const responseInfo: IMessageResponseInfo = {
                            resolve: resolve,
                            reject: reject,
                            sentMessage: message,
                            pierId: id,
                            date: new Date(),
                            timeout: setTimeout(() => {
                                reject(new Error("Timeout waiting for response"));
                            }, process.env.NODE_ENV === 'development' ? 600000 : timeout*1000)
                        };
                        SocketService.messageResponseRegistry.set(message.responseId, responseInfo);
                        socket.send(MessageBuilder.toMessage(message));
                    }
                    catch(e) {
                        reject(new SendWebSocketMessageError({
                            pierMessage: message,
                            error: e.toString()
                        }));
                    }
                }
            }
            else {
                reject(new NoPierAvailableError({
                    message: message
                }));
            }
        });
    }

    private sendMessage(socket: Socket, msg: IMessage) {
        return socket.send(MessageBuilder.toMessage(msg));
    }

    sendMessageWithoutResponse(clientId: any, message: IMessage) {
        return new Promise<IMessage>(async (resolve, reject) => {
            if (SocketService.connectedClients.get(clientId)) {
                try {
                    message.responseId = this.randomResponseId();
                    message.waitForResponse = false;
                    const socket = SocketService.connectedClients.get(clientId);

                    socket.send(MessageBuilder.toMessage(message));

                    return resolve(message);
                }
                catch(e) {
                    reject(new SendWebSocketMessageError({
                        pierMessage: message,
                        error: e.toString()
                    }));
                }
            }
            else {
                reject(new NoPierAvailableError({
                    message: message
                }));
            }
        });
    }

    sendMessageToRobotWithResponse(robot_id: string, runRobotMessage: IMessage, timeout: number = 60) : Promise<IMessage> {
        return new Promise(async (resolve, reject) => {
            return this.sendMessageWithResponse(robot_id, runRobotMessage, timeout)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    waitForRobotRegistration(identifier: string, timeout: number = 60) {
        return new Promise((resolve, reject) => {
            if (process.env.NODE_ENV === 'development') {
                timeout = 600000;
            }
            const timeoutCtrl = setTimeout(() => {
                reject(new Error("Timeout waiting for robot registration"));
            }, timeout*1000);
            const intervalCtrl = setInterval(() => {
                if (SocketService.connectedRobots.get(identifier) && SocketService.connectedRobots.get(identifier).length > 0) {
                    const firstSocket = SocketService.connectedRobots.get(identifier)[0];
                    this.logger.debug("Robot registered", firstSocket);
                    clearInterval(intervalCtrl);
                    clearTimeout(timeoutCtrl);
                    resolve({
                        id: identifier,

                    });
                }
            }, 1000);
        });
    }
}