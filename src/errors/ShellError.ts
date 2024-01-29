import {RoboHarborError} from "./RoboHarborError";

export class ShellError extends RoboHarborError {
    constructor(message, parameters) {
        super(113, "Error while calling shell command: "+message,  parameters);
    }

    getTargetStatus(): number {
        return 500;
    }

}