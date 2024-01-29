import SourceService from "./SourceService";
import * as fs from "fs";

const os = require('os');
const shell = require('shelljs');

export default class GitSourceService extends SourceService {

    async downloadSource(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                return  shell.exec("git clone "+this.robot.source.url+" "+this.targetPath, {silent: false}, async (code, stdout, stderr) => {
                    if (code !== 0) {

                    }
                    else {
                        resolve();
                    }
                });
            }
            catch(e) {
                reject(e);
            }
        });
    }


    getSourceVersion(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                shell.exec("git ls-remote --sort=committerdate", {silent: false}, async (code, stdout, stderr) => {
                    if (code !== 0) {
                        reject(stderr);
                    }
                    else {
                        resolve(stdout.trim().split(/\t/g)[0]);
                    }
                });
            }
            catch(e) {
                reject(e);
            }
        });
    }

    isSourceAvailable(): Promise<boolean> {
        // check if .git exists
        // if not, return empty string
        if (!fs.existsSync(this.targetPath + "/.git")) {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }

    getLocalVersion(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                shell.exec("git rev-parse HEAD", {silent: false}, async (code, stdout, stderr) => {
                    if (code !== 0) {
                        reject(stderr);
                    }
                    else {
                        resolve(stdout.trim().split("\n")[0]);
                    }
                });
            }
            catch(e) {
                reject(e);
            }
        });
    }
}