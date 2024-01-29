import SourceService from "./SourceService";


export default class DockerSourceService extends SourceService {

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


    getSourceVersion(): Promise<string> {
        return Promise.resolve("");
    }

    isSourceAvailable(): Promise<boolean> {
        return Promise.resolve(false);
    }

    getLocalVersion(): Promise<string> {
        return Promise.resolve("");
    }
}