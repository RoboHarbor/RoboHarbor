import {forwardRef, Inject, Injectable, Logger} from '@nestjs/common';
import {IRobot} from "../models/robot/types";
import {Images} from "../db/images.model";
import * as k8s from '@kubernetes/client-node';
import {IRoboShellValidationResult} from "../models/harbor/types";
import {InjectModel} from "@nestjs/sequelize";
import {SocketService} from "../harbor/socket.service";

@Injectable()
export class PiersService {
    private readonly logger = new Logger(PiersService.name);
    private kubeClientApi: any;
    private kubeClientAppApi: any;

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
            this.kubeClientApi
                .listPodForAllNamespaces()
                .then((res: any) => {
                    const pods = res.body.items;
                    for (const pod of pods) {
                        if (pod.metadata.labels.appControlledBy === 'roboharbor') {
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

    startRobotDeployment(robot: IRobot, waitTillStarted: boolean = true) {
        return new Promise(async (resolve, reject) => {
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
                            robotId: robot.id.toString()
                        }
                    },
                    spec: {
                        replicas: 1,
                        selector: {
                            matchLabels: {
                                appControlledBy: 'roboharbor',
                                robotId: robot.id.toString()
                            }
                        },
                        template: {
                            metadata: {
                                labels: {
                                    appControlledBy: 'roboharbor',
                                    robotId: robot.id.toString()
                                }
                            },
                            spec: {
                                containers: [
                                    {
                                        name: 'robot',
                                        image: image.imageContainerName+':'+(image.version || 'latest'),
                                    }
                                ]
                            }
                        }
                    }
                };
                this.kubeClientAppApi.createNamespacedDeployment('default', deployment).then((res: any) => {
                    this.logger.log('Deployment Created');
                    this.logger.log(res);
                    if (waitTillStarted) {
                       /* this.socketService.waitForRobotRegistration(robot.identifier).then((res: any) => {
                            this.logger.log('Robot Registered');
                            this.logger.log(res);
                            resolve({
                                deployment: res.body
                            });
                        });*/
                    }
                    else {
                        resolve({
                            deployment: res.body
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
                }
                else {
                    this.logger.log('Loading from Local files');
                    const kc = new k8s.KubeConfig();
                    kc.loadFromDefault();
                    this.kubeClientApi = kc.makeApiClient(k8s.CoreV1Api);
                    this.kubeClientAppApi = kc.makeApiClient(k8s.AppsV1Api);
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

    validateRobot(bot: IRobot) : Promise<IRoboShellValidationResult> {
        return new Promise<IRoboShellValidationResult>((resolve, reject) => {
            try {
                bot.image = {
                    name: "validate-robot",
                }
                let returnedRobot = null;
                return this.startRobotDeployment(bot).then((res: any) => {
                    this.logger.log('Robot Deployment Started');
                    this.logger.log(res);
                    resolve({source: true});
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
}
