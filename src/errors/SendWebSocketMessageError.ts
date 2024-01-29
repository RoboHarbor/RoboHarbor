import {RoboHarborError} from "./RoboHarborError";

export class SendWebSocketMessageError extends RoboHarborError {
    constructor( body?: any) {
        super(112, "Send Websocket was not possible see error for more Info.", body);
    }

    getTargetStatus(): number {
        return 500;
    }
}