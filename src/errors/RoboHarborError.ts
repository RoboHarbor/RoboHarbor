import {HttpException} from "@nestjs/common";

export class RoboHarborError implements Error {
    constructor(errorKey: number, text: string, parameters: any = {}) {
        this.message = text;
        this.errorKey = errorKey;
        this.body = parameters;
        this.name = "RoboHarborError";
    }

    body: any;
    message: string;
    errorKey: number;
    name: string;

    getTargetStatus(): number {
        return 500;
    }

    getHttpException() {
        return new HttpException({
            errorKey: this.errorKey,
            message: this.message,
            status: this.getTargetStatus(),
            error: {
                ...this.body
            }
        }, this.getTargetStatus());
    }
}