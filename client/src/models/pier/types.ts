import {IAttribute} from "../../../../src/models/harbor/types";


export interface IImage {
    name: string;
    title: string,
    id?: number,
    imageContainerName: string;
    logo?: string;
    description: string;
    version: string;
    attributes: IAttribute[];
    url?: string;
}