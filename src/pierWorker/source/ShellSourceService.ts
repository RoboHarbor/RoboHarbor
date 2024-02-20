import SourceService from "./SourceService";
import {ISourceInfo} from "../../models/robot/types";


export default class ShellSourceService extends SourceService {

    async downloadSource(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                resolve();
            }
            catch(e) {
                reject(e);
            }
        });
    }

    reloadVersions(): Promise<ISourceInfo> {
        return Promise.resolve(undefined);
    }


    getSourceVersion(): Promise<{
        sourceVersion: string;
        sourceMessage: string;
    }> {
        return Promise.resolve({
            sourceVersion: "",
            sourceMessage: ""
        });
    }

    isSourceAvailable(): Promise<boolean> {
        return Promise.resolve(false);
    }

    getLocalVersion(): Promise<string> {
        return Promise.resolve("");
    }

    updateSource(): Promise<ISourceInfo> {
        return Promise.resolve(undefined);
    }
}