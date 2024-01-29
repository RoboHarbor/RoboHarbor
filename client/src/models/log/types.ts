

export abstract class UIWSMessage {
    abstract type: string;

}

export interface ILog {
    date: Date;
    level: string;
    logs: string;
}

export const toJSON = (message: any) => {
    return JSON.stringify(message);
}

export const fromJSON = (message: string) => {
    return JSON.parse(message);
}

export class FollowRobotLogMessage extends UIWSMessage {
    type = FollowRobotLogMessage.getType();
    robotId?: number;

    constructor(robotId?: number | undefined) {
        super();
        this.robotId = robotId;
    }

    static getType() {
        return 'follow-robot-log';
    }

}