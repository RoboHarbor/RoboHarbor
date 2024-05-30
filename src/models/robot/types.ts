
export enum BotType {
    forever = 'forever',
    single = 'single',
    cron = 'cron',
    pipeline = 'pipeline',
}

export interface ISourceInfo {
    localVersion: string;
    sourceVersion: string;
    sourceMessage?: string;
}

export interface ICredentialsInfo{
    username: string;
    password: string;
    sshKey: string;
    name: string;
    id?: number;
    mode?: string;
}

export interface IRobot {
    image: {
        name: string,
        attributes?: any,
        version?: string,
        config?: any,
    };
    secret?: string;
    robotContent?: any;
    updatedAt?: Date;
    files?: any;

    identifier?: string;
    source: {
        url: string;
        git?: string,

        branch?: string;
        type?: string;
        credentials?: ICredentialsInfo,

    };
    sourceInfo?: ISourceInfo,

    config: any;
    type: BotType;
    name: string;
    id?: number;
    enabled?: boolean;

}