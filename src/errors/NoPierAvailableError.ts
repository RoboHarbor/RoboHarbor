import {RoboHarborError} from "./RoboHarborError";

export class NoPierAvailableError extends RoboHarborError {
    constructor( body?: any) {
        super(111, "No pier available", body);
    }

    getTargetStatus(): number {
        return 400;
    }
}