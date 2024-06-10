import {Injectable, Logger} from "@nestjs/common";
import * as k8s from "@kubernetes/client-node";
import {AppsV1Api, BatchV1Api, CoreV1Api, V1Pod} from "@kubernetes/client-node";
const stream = require('stream');

export interface ICallbackLogEntry {
    message: string;
    timestamp: string;
    container: string;
    pod: string;
}

export interface ICallback {
    onLog: (log: ICallbackLogEntry, key: string) => void;
    onError: (error: ICallbackLogEntry, key: string) => void;
}
export interface ILog {
    callbacks: ICallback[];
    key: string;
    type: LogType;
    namespace: string;
    updating: boolean,
    typeName: string;
}

export interface ILogPod {
    req: any;
}

export enum LogType {
    DEPLOYMENT = "deployment",
    JOB = "job",
    CRONJOB = "cronjob",
}

@Injectable()
export class KubernetesLogService {
    basicConfig = {
        follow: true,
        timestamps: true,
        tailLines: 100,
        pretty: true,
        sinceSeconds: 60*30 // 30 minutes bakcwards
    }
    private registryOfFollows: Map<string, ILog> = new Map<string, ILog>();
    private registryOfPods: Map<string, Map<string, ILogPod>> = new Map<string, Map<string, ILogPod>>();

    private readonly logger = new Logger(KubernetesLogService.name);
    private kubeClientApi: CoreV1Api;
    private kubeClientAppBatch: BatchV1Api;
    private kubeClientAppApi: AppsV1Api;
    private kubeLogApi: any;

    constructor() {
        this.connectToKube();
        setInterval(() => this.reloadAllFollows(), 1000*30);
    }

    connectToKube() {
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
                    this.kubeLogApi = new k8s.Log(kc);
                }
                else {
                    this.logger.log('Loading from Local files');
                    const kc = new k8s.KubeConfig();
                    kc.loadFromDefault();
                    this.kubeClientApi = kc.makeApiClient(k8s.CoreV1Api);
                    this.kubeClientAppApi = kc.makeApiClient(k8s.AppsV1Api);
                    this.kubeClientAppBatch = kc.makeApiClient(k8s.BatchV1Api);
                    this.kubeLogApi = new k8s.Log(kc);
                }

            }
            catch(err) {
                this.logger.error(err);
                reject(err);
            }
        });
    }


    followLog(type: LogType, namespace: string, typeName: string, key: string, callback: ICallback) {
        // Follow logs of a pod
        if (!this.registryOfFollows.has(key)) {
            this.logger.debug("Starting follow log of already existing " + key);
            this.registryOfFollows.set(key, {
                callbacks: [],
                type: type,
                key: key,
                updating: false,
                namespace: namespace,
                typeName: typeName
            });
        }
        this.startOrUpdateFollowRobot(key);
        this.registryOfFollows.get(key).callbacks.push(callback);
    }

    stopFollowLogOfPod(key: string, callback: ICallback) {
        // Stop following logs of a pod
        if (this.registryOfFollows.has(key)) {
            this.registryOfFollows.set(key, {
                ...this.registryOfFollows.get(key),
                callbacks: this.registryOfFollows.get(key).callbacks.filter((cb) => cb !== callback),
            });
        }
        if (this.registryOfFollows.has(key) && this.registryOfFollows.get(key).callbacks.length === 0) {
            if (this.registryOfPods.has(key)) {
                this.registryOfPods.get(key).forEach((value, key) => {
                    try {
                        value.req.abort();
                    }
                    catch(e) {}
                });
                this.registryOfPods.delete(key);
            }
            this.registryOfFollows.delete(key);
        }
    }

    private getMetaInfo(namespace: string, type: LogType, typeName: string) {
        return new Promise(async (resolve, reject) => {
            try {
                switch (type) {
                    case LogType.DEPLOYMENT:
                        const deployment = await this.kubeClientAppApi.readNamespacedDeployment(typeName, namespace);
                        resolve(deployment.body);
                        break;
                    case LogType.JOB:
                        const job = await this.kubeClientAppBatch.readNamespacedJob(typeName, namespace);
                        resolve(job.body);
                        break;
                    case LogType.CRONJOB:
                        const cronjob = await this.kubeClientAppBatch.readNamespacedCronJob(typeName, namespace);
                        resolve(cronjob.body);
                        break;
                    default:
                        reject("Unknown type");
                        break;
                }
            }
            catch(err) {
                reject(err);
            }
        });
    }

    private reloadAllFollows() {
        return new Promise(async () => {
            this.registryOfFollows.forEach((value, key) => {
                this.startOrUpdateFollowRobot(key);
            });
        });
    }

    private startOrUpdateFollowRobot(key: string) {
        return new Promise(async () => {
            const entry = this.registryOfFollows.get(key);
            if (entry.updating) {
                return;
            }
            try {
                this.logger.debug("Starting follow log of " + key);
                entry.updating = true;

                const element : any = await this.getMetaInfo(entry.namespace, entry.type, entry.typeName);

                const firstSelector = element.spec.selector.matchLabels;
                const labelNames = Object.keys(firstSelector).filter((d) => d.toLowerCase().includes("name") || d.toLowerCase().includes("id"));
                if (labelNames.length === 0) {
                    return;
                }
                const labelName = labelNames[0];

                // Read all pods by label
                const listOfPods = await this.kubeClientApi.listNamespacedPod(entry.namespace, null, null, null, null, labelName+"="+firstSelector[labelName]);
                this.logger.debug("Found " + listOfPods.body.items.length + " pods for " + key);
                if (!listOfPods.body.items || listOfPods.body.items.length === 0) {
                    return;
                }

                if (!this.registryOfPods.has(key)) {
                    this.registryOfPods.set(key, new Map<string, ILogPod>());
                }

                this.logger.debug("Iterating pods for " + key);
                for (const pod of listOfPods.body.items) {
                    const podkey = pod.metadata.namespace + "/" + pod.metadata.name + "/" + pod.spec.containers[0].name;
                    if (this.registryOfPods.has(key)) {
                        this.logger.debug("Checking if pod " + podkey + " is already being followed");
                        if (!this.registryOfPods.get(key).has(podkey)) {
                            this.logger.debug("Starting follow log of " + podkey);
                            this.startFollowLogOfPod(key, pod);
                        }
                    }

                }

            }
            catch(e) {

            }
            finally {
                entry.updating = false;
            }

        });
    }

    private startFollowLogOfPod(key: string, pod: V1Pod) {
        return new Promise(async () => {
           try {
               // Start following logs of a pod
               // This is a placeholder for the actual implementation
               this.logger.log("Start following logs of " + key);
               const logStream = new stream.PassThrough();

               logStream.on('data', (chunk) => {
                   // use write rather than console.log to prevent double line feed
                   const reqdata = this.registryOfFollows.get(key);
                   reqdata.callbacks.forEach((cb) => {
                       try {
                           chunk.toString().split("\n").forEach((data: string) => {
                               if (data.length > 0) {
                                   this.logger.debug(data);
                                   cb.onLog({
                                       message: KubernetesLogService.removeDate(data),
                                       timestamp: KubernetesLogService.extractDate(data),
                                       container: pod.spec.containers[0].name,
                                       pod: pod.metadata.name
                                   }, key);
                               }
                           });
                       }
                       catch(e){}
                   });
               })
               const errorHappened = (err: any, podkey: string) => {
                   if (this.registryOfFollows.has(key)) {
                       for (const cb of this.registryOfFollows.get(key).callbacks) {
                           try {
                               this.logger.debug(err);
                               cb.onError({
                                      message: KubernetesLogService.removeDate(err.toString()),
                                      timestamp: KubernetesLogService.extractDate(err.toString()),
                                      container: pod.spec.containers[0].name,
                                      pod: pod.metadata.name
                               }, key);
                           } catch (e) {

                           }
                       }
                   }
                   this.logger.error(err);
                   if (this.registryOfPods.get(key) && this.registryOfPods.get(key).has(podkey)) {
                       this.registryOfPods.get(key).delete(podkey);
                   }
               }
               const podkey = pod.metadata.namespace + "/" + pod.metadata.name + "/" + pod.spec.containers[0].name;
               this.kubeLogApi.log(pod.metadata.namespace, pod.metadata.name, pod.spec.containers[0].name,
                   logStream, (err) => errorHappened(err, podkey)
                   , {
                       follow: true, tailLines: 10, pretty: true, timestamps: true, previous: false
                   })
                   .then(req => {
                        const reqdata = this.registryOfPods.get(key);
                        if (reqdata.has(podkey)) {
                            try {
                                reqdata.get(podkey).req.abort();
                            }
                            catch(e) {}
                        }
                        reqdata.set(podkey, {
                            req: req
                        });
                   })
                   .catch((err) => {
                       this.logger.error(err);
                   });
           }
           catch(e) {

           }
        });
    }

    private static removeDate(s: string) {
        // Remove ISO Date by regex
        return s.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.*Z)?/, "");
    }

    private static extractDate(s: string) {
        // Extract ISO Date by regex
        const date = s.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        if (date) {
            return date[0];
        }
        return null;
    }
}
