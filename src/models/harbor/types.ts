
export interface IAttribute {
    values: {value: string, label: string }[];
    name: string,
    type: string,
}

export interface IRunnerPackage{
    title: any;
    description: string;
    name: string,
    id: number,
    logo: string,
    shellCommandForPackageInstallation: string,
    parameters?: boolean,
    environmentVariables?: boolean,
    attributes?: IAttribute[]
}

export interface DetectedRunner {
    name: string,
}


export interface IRoboShellValidationResult {
    source: boolean,
    possibleRunners?: DetectedRunner[]
}