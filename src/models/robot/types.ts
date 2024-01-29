
export enum BotType {
    forever = 'forever',
    manual = 'manual',
}

export interface ISourceInfo {
    localVersion: string;
    sourceVersion: string;
}

export interface IRobot {
    source: {
        type: string,
        url?: string,
        branch?: string,

    };
    sourceInfo?: ISourceInfo,

    runner: {
        type: string,
        config?: any,
    };
    config: any;
    type: BotType;
    name: string;
    id?: number;
    enabled?: boolean;

}