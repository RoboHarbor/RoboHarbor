import {DetectedRunner } from "../../models/harbor/types";
const shell = require("shelljs");

export async function  evaluateCorrectRunner(path: string) : Promise<DetectedRunner[]> {
    return new Promise(async (resolve, reject) => {
       try {
           const possibleRunners = [];

           // When we have a "package.json" the runner is "npm"
           if (await shell.test("-f", path+"/package.json")) {
               possibleRunners.push({
                   name: "node"
               })
           }
           if (await shell.test("-f", path+"/docker-compose.yml")) {
               possibleRunners.push({
                   name: "docker"
               })
           }
           if (await shell.test("-f", path+"/requirements.txt")) {
               possibleRunners.push({
                     name: "python"
               })
           }

           return resolve(possibleRunners);
       }
     catch(e) {
          return reject(e);
     }
     return resolve(null);
    });
}