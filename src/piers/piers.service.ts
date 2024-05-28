import {forwardRef, Inject, Injectable, Logger} from '@nestjs/common';
import {IRobot} from "../models/robot/types";
import {Images} from "../db/images.model";
import * as k8s from '@kubernetes/client-node';
import {IRoboShellValidationResult} from "../models/harbor/types";
import {InjectModel} from "@nestjs/sequelize";
import {MessageBuilder, SocketService} from "../harbor/socket.service";
import {AppsV1Api, BatchV1Api, CoreV1Api} from "@kubernetes/client-node";

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
    ) {
    }

    // on start
    onModuleInit() {
        this.logger.log('PierServiceService has been initialized.');

        this.startPierService();
        setInterval(() => {
            this.startPierService();
        }, 20000);
    }

    getAllRoboHarborDeployments() {
        return new Promise<any[]>((resolve, reject) => {
            const list: any[] = [];
            this.logger.log('Getting all Robo Harbor Deployments');
            // Find all pods with the label appControlledBy=roboharbor
            this.kubeClientAppApi
                .listNamespacedDeployment('default')
                .then((res: any) => {
                    const pods = res.body.items;
                    for (const pod of pods) {
                        if (pod.metadata.labels && pod.metadata.labels.appControlledBy === 'roboharbor') {
                            list.push(pod)
                        }
                    }
                }).catch((err: any) => {
                    this.logger.error(err);
                    reject(err);
                });
            return resolve(list);
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

    startRobotJob(robot: IRobot) : Promise<IDeploymentWithRobot> {
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
                            robotId: robot.identifier
                        }
                    },
                    spec: {
                        replicas: 1,
                        template: {
                            metadata: {
                                labels: {
                                    appControlledBy: 'roboharbor',
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
                                        image: image.imageContainerName + ':latest'
                                    }
                                ]
                            }
                        }
                    }
                };
                this.createJob('default', deployment).then((resDepl: any) => {
                    this.logger.log('Job Created');
                    this.logger.log(resDepl);
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
                        .catch((err) => {
                            reject(err);

                        })
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

    getEnvironmentVariables(robot: IRobot) {
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
                value: "secret"
            },
            {
                name: 'POD_NAME',
                valueFrom: {fieldRef: {fieldPath: "metadata.name"}}
            }
        ];
    }

    startRobotDeployment(robot: IRobot, waitTillStarted: boolean = true) : Promise<IDeploymentWithRobot> {
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
                            robotId: robot.identifier
                        }
                    },
                    spec: {
                        replicas: 1,
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
                                    robotId: robot.identifier
                                }
                            },
                            spec: {
                                containers: [
                                    {
                                        name: 'robot',
                                        image: image.imageContainerName+':'+(image.version || 'latest'),
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
        return new Promise((resolve, reject) => {
            try {
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

                const currentRoboHarborDeployments = this.getAllRoboHarborDeployments();
                currentRoboHarborDeployments.then((res: any) => {
                    this.logger.log('All Robo Harbor Deployments:');
                    this.logger.log(res);
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
                return this.startRobotJob(bot).then((res: any) => {
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
                        if (pod.metadata.labels && pod.metadata.labels.robotId === id) {
                            this.kubeClientApi.deleteNamespacedPod(pod.metadata.name, 'default').then((res: any) => {
                                this.logger.log('Pod Deleted');
                            }).catch((err: any) => {
                                this.logger.error(err);
                            });
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
                        if (pod.metadata.labels && pod.metadata.labels.robotId === id) {
                            this.kubeClientApi.deleteNamespacedPod(pod.metadata.name, 'default').then((res: any) => {
                                this.logger.log('Pod Deleted');
                            }).catch((err: any) => {
                                this.logger.error(err);
                            });
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
}
