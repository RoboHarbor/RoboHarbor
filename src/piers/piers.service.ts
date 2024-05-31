import {forwardRef, Inject, Injectable, Logger} from '@nestjs/common';
import {IRobot} from "../models/robot/types";
import {Images} from "../db/images.model";
import * as k8s from '@kubernetes/client-node';
import {IRoboShellValidationResult} from "../models/harbor/types";
import {InjectModel} from "@nestjs/sequelize";
import {MessageBuilder, SocketService} from "../harbor/socket.service";
import {AppsV1Api, BatchV1Api, CoreV1Api} from "@kubernetes/client-node";
import {Robot} from "../db/robot";

export interface IDeploymentWithRobot{
    deployment: {
        metadata: {
            name: string
        }
    },
    robot: {
        id: string,
        pod_id?: string
    }

}

@Injectable()
export class PiersService {
    private readonly logger = new Logger(PiersService.name);
    private kubeClientApi: CoreV1Api;
    private kubeClientAppBatch: BatchV1Api;
    private kubeClientAppApi: AppsV1Api;

    constructor(
        @Inject(forwardRef(() => SocketService))
        private socketService: SocketService,
        @InjectModel(Images)
        private imageModel: typeof Images,
        @InjectModel(Robot)
        private robotModel: typeof Robot
    ) {
    }

    // on start
    onModuleInit() {
        this.logger.log('PierServiceService has been initialized.');

        this.startPierService();
        setInterval(() => {
            this.startPierService();
        }, 5000);
        this.checkForAllRobots();
        setInterval(() => {
            this.checkForAllRobots();
        }, 60000);
    }

    getAllRoboHarborDeployments() {
        return new Promise<any[]>((resolve, reject) => {
            const list: any[] = [];
            this.logger.log('Getting all Robo Harbor Deployments');
            // Find all pods with the label appControlledBy=roboharbor
            return Promise.all([
                this.kubeClientAppApi
                    .listNamespacedDeployment('default').then((res: any) => { return res.body.items.map((e) => {
                            e.kind = 'Deployment';
                            return e;
                        });
                    }),
                this.kubeClientAppBatch
                            .listNamespacedCronJob('default').then((res: any) => { return res.body.items.map((e) => {
                            e.kind = 'CronJob';
                            return e;
                        });
                    }),
                this.kubeClientAppBatch
                    .listNamespacedJob('default').then((res: any) => { return res.body.items.map((e) => {
                            e.kind = 'Job';
                            return e;
                        });
                    })
            ])
                .then((res: any[]) => {

                    const pods = res.flatMap((r) => r);
                    for (const pod of pods) {
                        if (pod.metadata.labels && pod.metadata.labels.appControlledBy === 'roboharbor') {
                            list.push(pod)
                        }
                    }
                    return resolve(list);
                }).catch((err: any) => {
                    this.logger.error(err);
                    reject(err);
                });
        });
    }

    createCronJob(namespace: string, jobData: any) {
        return new Promise((resolve, reject) => {
            if (process.env.DEV_KUBERNETES !== 'development') {
                this.kubeClientAppBatch.createNamespacedCronJob(namespace, jobData).then((res: any) => {
                    resolve(res);
                }).catch((err: any) => {
                    reject(err);
                });
            }
            else {
                this.logger.debug(' Create cron job by yourself', JSON.stringify(jobData));

                return resolve({
                    body: {
                        metadata: {
                            name: 'test'
                        }
                    }
                })
            }
        });
    }

    createJob(namespace: string, jobData: any) {
        return new Promise((resolve, reject) => {
            if (process.env.DEV_KUBERNETES !== 'development') {
                this.kubeClientAppBatch.createNamespacedJob(namespace, jobData).then((res: any) => {
                    resolve(res);
                }).catch((err: any) => {
                    reject(err);
                });
            }
            else {
                this.logger.debug(' Create job by yourself', JSON.stringify(jobData));

                return resolve({
                    body: {
                        metadata: {
                            name: 'test'
                        }
                    }
                })
            }
        });
    }

    createDeployement(namespace: string, deployment: any) {
        return new Promise((resolve, reject) => {
            if (process.env.DEV_KUBERNETES !== 'development') {
                this.kubeClientAppApi.createNamespacedDeployment(namespace, deployment).then((res: any) => {
                    resolve(res);
                }).catch((err: any) => {
                    reject(err);
                });
            }
            else {
                this.logger.debug(' Create deployment by yourself', JSON.stringify(deployment));
                
                return resolve({
                    body: {
                        metadata: {
                            name: 'test'
                        }
                    }
                })
            }
        });
    }

    startRobotCronJob(robot: IRobot, directStart: boolean = true) : Promise<IDeploymentWithRobot> {
        return new Promise<IDeploymentWithRobot>(async (resolve, reject) => {
            try {
                this.logger.log('Starting Robot Job');
                const image = await this.imageModel.findOne({where: {name: robot.image.name}});
                const deployment = {
                    apiVersion: 'batch/v1',
                    kind: 'CronJob',
                    metadata: {
                        name: robot.identifier,
                        labels: {
                            appControlledBy: 'roboharbor',
                            updatedAt: robot.updatedAt.getTime().toString(),
                            robotId: robot.identifier
                        }
                    },
                    spec: {
                        replicas: directStart ? 1 : 0,
                        template: {
                            metadata: {
                                labels: {
                                    appControlledBy: 'roboharbor',
                                    updatedAt: robot.updatedAt.getTime().toString(),
                                    robotId: robot.identifier
                                }
                            },
                            spec: {
                                restartPolicy: 'Never',
                                containers: [
                                    {
                                        env: [
                                            ...this.getEnvironmentVariables(robot),
                                        ],
                                        name: 'robot',
                                        image: image.imageContainerName+':'+(image.imageContainerVersion || 'latest'),
                                    }
                                ]
                            }
                        }
                    }
                };
                this.createCronJob('default', deployment).then((resDepl: any) => {
                    this.logger.log('Job Created');
                    this.logger.log(resDepl);
                    resolve({
                        deployment: {
                            metadata: {
                                name: resDepl.body.metadata.name
                            }
                        },
                        robot: {
                            id: robot.identifier
                        }
                    });

                }).catch((err: any) => {
                    this.logger.error(err);
                    reject(err);
                });
            } catch (err) {
                this.logger.error(err);
                reject(err);
            }
        });
    }

    startRobotJob(robot: IRobot, waitTillStarted: boolean = false, directStart: boolean = true) : Promise<IDeploymentWithRobot> {
        return new Promise<IDeploymentWithRobot>(async (resolve, reject) => {
            try {
                this.logger.log('Starting Robot Job');
                const image = await this.imageModel.findOne({where: {name: robot.image.name}});
                const deployment = {
                    apiVersion: 'batch/v1',
                    kind: 'Job',
                    metadata: {
                        name: robot.identifier,
                        labels: {
                            appControlledBy: 'roboharbor',
                            updatedAt: robot.updatedAt.getTime().toString(),
                            robotId: robot.identifier
                        }
                    },
                    spec: {
                        replicas: directStart ? 1 : 0,
                        template: {
                            metadata: {
                                labels: {
                                    appControlledBy: 'roboharbor',
                                    updatedAt: robot.updatedAt.getTime().toString(),
                                    robotId: robot.identifier
                                }
                            },
                            spec: {
                                restartPolicy: 'Never',
                                containers: [
                                    {
                                        env: [
                                            ...this.getEnvironmentVariables(robot),
                                        ],
                                        name: 'robot',
                                        image: image.imageContainerName+':'+(image.imageContainerVersion || 'latest'),
                                    }
                                ]
                            }
                        }
                    }
                };
                this.createJob('default', deployment).then((resDepl: any) => {
                    this.logger.log('Job Created');
                    this.logger.log(resDepl);
                    if (waitTillStarted) {
                        this.socketService.waitForRobotRegistration(robot.identifier)
                            .then((res: any) => {
                                this.logger.log('Robot Registered');
                                this.logger.log(res);
                                resolve({
                                    deployment: {
                                        metadata: {
                                            name: resDepl.body.metadata.name,
                                        }
                                    },
                                    robot: {
                                        pod_id: res.pod_id,
                                        id: robot.identifier
                                    }
                                });
                            })
                            .catch((err) => {
                                reject(err);

                            })
                    }
                    else {
                        resolve({
                            deployment: {
                                metadata: {
                                    name: resDepl.body.metadata.name
                                }
                            },
                            robot: {
                                id: robot.identifier
                            }
                        });
                    }

                }).catch((err: any) => {
                    this.logger.error(err);
                    reject(err);
                });
            } catch (err) {
                this.logger.error(err);
                reject(err);
            }
        });
    }

    getSpecialEnvirons(robot: IRobot) {
        return Object.keys(robot.image?.config?.env || {})
            .map((k) => {
                const val = robot.image?.config?.env[k];
                return {
                    name: k,
                    value: val
                };
            });
    }

    getEnvironmentVariables(robot: IRobot, currentEnv: any[] = []) {
        const specialEnvirons = this.getSpecialEnvirons(robot);
        return [
            {
                name: 'ROBO_ID',
                value: robot.identifier.toString()
            },
            {
                name: 'ROBO_HARBOR',
                value: 'roboharbor:5001'
            },
            {
                name: 'ROBO_SECRET',
                value: robot.secret.toString()
            },
            {
                name: 'POD_NAME',
                valueFrom: {fieldRef: {fieldPath: "metadata.name"}}
            },
            ...specialEnvirons
        ].filter((env) => {
            return !currentEnv.find((e) => e.name === env.name);
        });
    }

    createRobotInCluster(robot: IRobot) {
        return new Promise((resolve, reject) => {
            try {
                if (robot.type == "forever") {
                    this.startRobotDeployment(robot, false, robot.enabled == true ? 1 : 0).then((res: any) => {
                        resolve(res);
                    }).catch((err: any) => {
                        reject(err);
                    });
                }
                else if (robot.type == "single") {
                    this.startRobotJob(robot, false, false).then((res: any) => {
                        resolve(res);
                    }).catch((err: any) => {
                        reject(err);
                    });
                }
                else if (robot.type == "cron") {
                    this.startRobotCronJob(robot, false).then((res: any) => {
                        resolve(res);
                    }).catch((err: any) => {
                        reject(err);
                    });
                }
                else if (robot.type == "pipeline") {
                    this.startRobotJob(robot, false, false).then((res: any) => {
                        resolve(res);
                    }).catch((err: any) => {
                        reject(err);
                    });
                }
            }
            catch(e) {
                reject(e);
            }
        });
    }

    startRobotDeployment(robot: IRobot, waitTillStarted: boolean = true, replicas: number = 1) : Promise<IDeploymentWithRobot> {
        return new Promise<IDeploymentWithRobot>(async (resolve, reject) => {
            try {
                this.logger.log('Starting Robot Deployment');
                const image = await this.imageModel.findOne({where: {name: robot.image.name}});
                const deployment = {
                    apiVersion: 'apps/v1',
                    kind: 'Deployment',
                    metadata: {
                        name: robot.identifier,
                        labels: {
                            appControlledBy: 'roboharbor',
                            robotId: robot.identifier,
                            updatedAt: robot.updatedAt.getTime().toString(),
                        }
                    },
                    spec: {
                        replicas: replicas,
                        selector: {
                            matchLabels: {
                                appControlledBy: 'roboharbor',
                                robotId: robot.identifier
                            }
                        },
                        template: {
                            metadata: {
                                labels: {
                                    appControlledBy: 'roboharbor',
                                    robotId: robot.identifier,
                                    updatedAt: robot.updatedAt.getTime().toString(),
                                }
                            },
                            spec: {
                                containers: [
                                    {
                                        name: 'robot',
                                        image: image.imageContainerName+':'+(image.imageContainerVersion || 'latest'),
                                        env: [
                                            ...this.getEnvironmentVariables(robot),
                                        ],
                                    }
                                ]
                            }
                        }
                    }
                };
                this.createDeployement('default', deployment).then((resDepl: any) => {
                    this.logger.log('Deployment Created');
                    this.logger.log(resDepl);
                    if (waitTillStarted) {
                       this.socketService.waitForRobotRegistration(robot.identifier)
                           .then((res: any) => {
                                this.logger.log('Robot Registered');
                                this.logger.log(res);
                               resolve({
                                   deployment: {
                                       metadata: {
                                           name: resDepl.body.metadata.name
                                       }
                                   },
                                   robot: {
                                       pod_id: res.pod_id,
                                       id: robot.identifier
                                   }
                               });
                        })
                       .catch((err)=> {
                           reject(err);

                       })
                    }
                    else {
                        resolve({
                            deployment: {
                                metadata: {
                                    name: resDepl.body.metadata.name
                                }
                            },
                            robot: {
                                id: robot.identifier
                            }
                        });
                    }
                }).catch((err: any) => {
                    this.logger.error(err);
                    reject(err);
                });
            }
            catch(err) {
                this.logger.error(err);
                reject(err);
            }
        });
    }

    startPierService() {
        return new Promise<void>((resolve, reject) => {
            try {
                if (this.kubeClientApi && this.kubeClientAppApi && this.kubeClientAppBatch) {
                    resolve();
                }
                this.logger.log('Starting Pier Service');
                if (process.env.NODE_ENV !== 'development') {
                    this.logger.log('Loading from Cluster');
                    const kc = new k8s.KubeConfig();
                    kc.loadFromCluster();
                    this.kubeClientApi = kc.makeApiClient(k8s.CoreV1Api);
                    this.kubeClientAppApi = kc.makeApiClient(k8s.AppsV1Api);
                    this.kubeClientAppBatch = kc.makeApiClient(k8s.BatchV1Api);
                }
                else {
                    this.logger.log('Loading from Local files');
                    const kc = new k8s.KubeConfig();
                    kc.loadFromDefault();
                    this.kubeClientApi = kc.makeApiClient(k8s.CoreV1Api);
                    this.kubeClientAppApi = kc.makeApiClient(k8s.AppsV1Api);
                    this.kubeClientAppBatch = kc.makeApiClient(k8s.BatchV1Api);
                }
            }
            catch(err) {
                this.logger.error(err);
                reject(err);
            }
        });
    }

    containsAFile(list_of_files: string[], file: string) {
        return list_of_files.map(d => d.toLowerCase()).includes(file);
    }

    findPossibleImages(list_of_files: string[]) {
        const possibleImages: any[] = [];
        if (this.containsAFile(list_of_files, 'Dockerfile')) {
            possibleImages.push({name: 'docker'});
        }
        if (this.containsAFile(list_of_files, 'package.json')) {
            possibleImages.push({name: 'nodejs'});
        }
        if (this.containsAFile(list_of_files, 'requirements.txt')) {
            possibleImages.push({name: 'python'});
        }
        return possibleImages;
    }

    validateRobot(bot: IRobot) : Promise<IRoboShellValidationResult> {
        return new Promise<IRoboShellValidationResult>((resolve, reject) => {
            try {
                bot.image = {
                    name: "validate-robot",
                    version: "latest"
                }
                let returnedRobot = null;
                return this.startRobotJob(bot, true, true).then((res: any) => {
                    this.logger.debug('Robot Deployment Started');
                    this.logger.debug(res);
                    return this.socketService.sendMessageToRobotWithResponse(res.robot.id,
                        MessageBuilder.validateRobotMessage(bot),
                        60000)
                        .then((resVal: any) => {
                            this.logger.debug('Robot Validation Response')
                            this.logger.debug(resVal);
                            if (resVal) {
                                if (resVal.success === false) {
                                    return resolve({
                                        source: false,
                                        isError: true,
                                        error: resVal.error
                                    } as IRoboShellValidationResult);

                                }
                                else {
                                    return resolve({
                                        source: true,
                                        possibleImages: this.findPossibleImages(resVal.files),
                                    } as IRoboShellValidationResult);
                                }
                            }
                            else {
                                return reject('No response from robot');
                            }

                        })
                        .catch((err)=> {
                            this.logger.error(err);
                            reject(err);

                        })
                        .finally(() => {
                            return this.deleteRobotJob(res.robot.id)
                                .then((d) => {

                                })
                                .catch((er) => {

                                })
                        })
                })
                .catch((err: any) => {
                    this.logger.error(err);
                    reject(err);
                })
                .finally(() => {
                    this.logger.log('Robot Deployment Started');
                });

            }
            catch(err) {
                this.logger.error(err);
                reject(err);
            }
        });
    }

    private deleteRobotDeployment(id: string, deletePod=true) {
        return new Promise((resolve, reject) => {
            // Find the replica set from the deployment
            this.kubeClientAppApi.deleteNamespacedDeployment(id, 'default').then((res: any) => {
                // Delete all pods with the  label robotId=id
                this.kubeClientApi.listNamespacedPod('default').then((res: any) => {
                    const pods = res.body.items;
                    for (const pod of pods) {
                        try {
                            if (pod.metadata.labels && pod.metadata.labels.robotId === id) {
                                this.kubeClientApi.deleteNamespacedPod(pod.metadata.name, 'default').then((res: any) => {
                                    this.logger.log('Pod Deleted');
                                }).catch((err: any) => {
                                    this.logger.error(err);
                                });
                            }
                        }
                        catch(e) {

                        }
                    }
                }).catch((err: any) => {
                    this.logger.error(err);
                })
                .finally(() => {
                    resolve(res);
                });
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    private deleteRobotJob(id: string, deletePod=true) {
        return new Promise((resolve, reject) => {
            this.logger.debug("Deleting Job for robot", id);
            this.kubeClientAppBatch.deleteNamespacedJob(id, 'default').then((res: any) => {
                // Delete all pods with the  label robotId=id
                this.kubeClientApi.listNamespacedPod('default').then((res: any) => {
                    const pods = res.body.items;
                    for (const pod of pods) {
                        try {
                            if (pod.metadata.labels && pod.metadata.labels.robotId === id) {
                                this.kubeClientApi.deleteNamespacedPod(pod.metadata.name, 'default').then((res: any) => {
                                    this.logger.log('Pod Deleted');
                                }).catch((err: any) => {
                                    this.logger.error(err);
                                });
                            }
                        }
                        catch(e) {

                        }
                    }
                }).catch((err: any) => {
                    this.logger.error(err);
                })
                .finally(() => {
                    resolve(res);
                });
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    checkForAllRobots() {
        return new Promise(async (resolve, reject) => {
            this.logger.log('Checking for all robots');
            const robots = await this.robotModel.findAll();
            return Promise.all(
                robots.map((robot: Robot) => {
                    return this.checkIfRobotIsCreatedAndUpToDate(robot).catch((err: any) => {
                        this.logger.error(err);
                    });
                })
            ).then(async (res: any) => {
                this.logger.log('All Robots created');
                this.logger.log(res);
                resolve(res);

                const allRobotsDeployed = await this.getAllRoboHarborDeployments();
                for (const robot of allRobotsDeployed) {
                    try {
                        const found = await this.robotModel.findOne({where: {identifier: robot.metadata?.labels?.robotId}});
                        if (!found) {
                            if (robot.spec?.template.spec?.containers[0]?.image.includes("validate-robot") != false) {
                                continue;
                            }
                            try {
                                this.removeRobotFromCluster(robot);
                            }
                            catch(e) {

                            }
                        }
                    }
                    catch(e) {

                    }
                }
            })
            .catch((err: any) => {
                this.logger.error(err);
                reject(err);
            });
        });
    }

    createRobot(robot: Robot) {
        return new Promise((resolve, reject) => {
            this.logger.log('Creating Robot');
            return this.checkIfRobotIsCreatedAndUpToDate(robot).then((res: any) => {
                this.logger.log('All Robots');
                this.logger.log(res);
                return resolve(res);
            })
            .catch((e)=> {
                reject(e);

            })
        });
    }

    runRobot(robot: Robot) {
        return new Promise((resolve, reject) => {
            this.logger.log('Creating Robot');
            return this.checkIfRobotIsCreatedAndUpToDate(robot).then((res: any) => {
                if (res && res.metadata?.labels?.robotId === robot.identifier) {
                    if (res.spec?.replicas > 0) {
                        return resolve(res);
                    }
                }
                return resolve(res);
            })
            .catch((e)=> {
                reject(e);

            })
        });
    }

    stopRobot(robot: Robot) {
        return new Promise((resolve, reject) => {
            this.logger.log('Creating Robot');
            return this.checkIfRobotIsCreatedAndUpToDate(robot).then((res: any) => {
                if (res && res.metadata?.labels?.robotId === robot.identifier) {
                    if (res.spec?.replicas <= 0) {
                        return resolve(res);
                    }
                }
                return resolve(res);
            })
            .catch((e)=> {
                reject(e);

            })
        });
    }

    private checkIfRobotIsCreatedAndUpToDate(robot: Robot) {
        return new Promise((resolve, reject) => {
            this.logger.log('Checking if robot is created '+robot.identifier);
            return this.getAllRoboHarborDeployments().then((res: any) => {
                this.logger.log('All Robots');
                this.logger.log(res);
                const found = res.find((r: any) => r.metadata?.labels?.robotId === robot.identifier);

                if (!found) {
                    return this.createRobotInCluster(robot).then((res: any) => {
                        return resolve(res);
                    }).catch((err: any) => {
                        return reject(err);
                    });
                }
                else {
                    if (found.metadata?.labels?.updatedAt !== robot.updatedAt.getTime().toString()) {
                        return this.updateRobot(robot, found).then((res: any) => {
                            return resolve(res);
                        }).catch((err: any) => {
                            return reject(err);
                        });
                    }
                }

                return resolve(found);
            });
        });
    }

    private removeRobotFromCluster(robot: any) {
        return new Promise((resolve, reject) => {
            this.logger.log('Removing Robot from Cluster');
            if (robot.kind == 'Deployment') {
                return this.deleteRobotDeployment(robot.metadata?.name).then((res: any) => {
                    this.logger.log('Robot Removed');
                    this.logger.log(res);
                    return resolve(res);
                })
                    .catch((err: any) => {
                        return reject(err);
                    });
            }
            else if (robot.kind == 'Job') {
                return this.deleteRobotJob(robot.metadata?.name).then((res: any) => {
                    this.logger.log('Robot Removed');
                    this.logger.log(res);
                    return resolve(res);
                })
                    .catch((err: any) => {
                        return reject(err);
                    });
            }
            else if (robot.kind == 'CronJob') {
                return this.kubeClientAppBatch.deleteNamespacedCronJob(robot.metadata?.name, 'default').then((res: any) => {
                    this.logger.log('Robot Removed');
                    this.logger.log(res);
                    return resolve(res);
                })
                    .catch((err: any) => {
                        return reject(err);
                    });
            }
            else {
                return resolve(robot);
            }
        });
    }

    updateRobot(robot: Robot, config: any) {
        return new Promise((resolve, reject) => {
            if (config && robot) {
                config = JSON.parse(JSON.stringify(config));
                delete config.status;
                delete config.metadata?.annotations;
                delete config.metadata?.managedFields;
                delete config.metadata?.creationTimestamp;
                delete config.metadata?.generation;
                delete config.metadata?.resourceVersion;
                delete config.metadata?.selfLink;
                delete config.metadata?.uid;
                delete config.metadata?.ownerReferences;

                delete config.spec?.strategy;
                delete config.spec?.progressDeadlineSeconds;
                delete config.spec?.revisionHistoryLimit;

                const oldConfig = JSON.parse(JSON.stringify(config));
                if (config.spec && config.spec.replicas == 0 && robot.enabled == true) {
                    config.spec.replicas = 1;
                }
                else if (config.spec && config.spec.replicas > 0 && robot.enabled == false) {
                    config.spec.replicas = 0;
                }

                if (config.metadata.labels) {
                    config.metadata.labels.updatedAt = robot.updatedAt.getTime().toString();
                }
                if (config.spec.template.metadata.labels) {
                    config.spec.template.metadata.labels.updatedAt = robot.updatedAt.getTime().toString();
                }

                if (config.spec?.template?.spec?.containers && config.spec?.template?.spec?.containers.length > 0) {
                    config.spec.template.spec.containers[0].env = [
                        ...config.spec?.template?.spec?.containers[0].env,
                        ...this.getEnvironmentVariables(robot, config.spec.template.spec.containers[0].env),
                    ];
                }

                if (JSON.stringify(oldConfig) != JSON.stringify(config)) {
                    if (robot.type == "forever") {
                        return this.kubeClientAppApi.replaceNamespacedDeployment(robot.identifier, 'default', config).then((res: any) => {
                            this.logger.log('Robot Updated');
                            this.logger.log(res);
                            return resolve(res);
                        }).catch((err: any) => {
                            return reject(err);
                        });
                    }
                    else if (robot.type == "single") {
                        return this.kubeClientAppBatch.replaceNamespacedJob(robot.identifier, 'default', config).then((res: any) => {
                            this.logger.log('Robot Updated');
                            this.logger.log(res);
                            return resolve(res);
                        }).catch((err: any) => {
                            return reject(err);
                        });
                    }
                    else if (robot.type == "cron") {
                        return this.kubeClientAppBatch.replaceNamespacedCronJob(robot.identifier, 'default', config).then((res: any) => {
                            this.logger.log('Robot Updated');
                            this.logger.log(res);
                            return resolve(res);
                        }).catch((err: any) => {
                            return reject(err);
                        });
                    }
                    else if (robot.type == "pipeline") {
                        return this.kubeClientAppBatch.replaceNamespacedJob(robot.identifier, 'default', config).then((res: any) => {
                            this.logger.log('Robot Updated');
                            this.logger.log(res);
                            return resolve(res);
                        }).catch((err: any) => {
                            return reject(err);
                        });
                    }
                }
                else {
                    return resolve(config);
                }
            }
        });
    }
}
