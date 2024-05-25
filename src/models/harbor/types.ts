import {IImage} from "../../../client/src/models/pier/types";

export interface IAttribute {
    values?: {value: string, label: string }[];
    name: string,
    type: string,
    label?: string,
}

export interface IImagesModel extends IImage {

}


export interface DetectedRunner {
    name: string,
}


export interface IRoboShellValidationResult {
    error_code?: number;
    source: boolean,
    isError?: boolean,
    error?: string,
    possibleRunners?: DetectedRunner[]
}