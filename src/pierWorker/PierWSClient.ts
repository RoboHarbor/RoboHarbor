import {IMessage, MessageBuilder} from "../harbor/socket.service";

const WebSocketClient = require('websocket').client;

export interface IPierWSListener {

    onMessage(msg: IMessage): void;
}

export class PierWSClient {
    private pierName: string;
    private listeners: IPierWSListener[] = [];
    private ws: any;
    private connection: any;
    private messageRegistry = [];

    constructor(pierName: string) {
        this.pierName = pierName;
    }

    public connect() {
        console.log("Connecting to harbor: "+process.env.HARBOR_URL+":"+process.env.HARBOR_PORT);
        this.ws = new WebSocketClient();
        this.ws.on('connectFailed', function(error) {
            console.log('Connect Error: ' + error.toString());
        });
        this.ws.on("connect", (connection) => {
            console.log("connected to harbor");

            connection.on('error', (error) => {
                console.log("Connection error: " + error.toString());
            });
            connection.on('close', () => {
                console.log('Connection closed!');
                setTimeout(() => {
                    this.connect();
                }, 1500);
            });

            connection.on('message', (message) => {
                const msg = MessageBuilder.fromMessage(message.utf8Data);
                if (msg.isResponse) {
                    this.messageRegistry.forEach((info) => {
                        if (info.responseId === msg.responseId) {
                            info.response = msg;
                            clearTimeout(info.timeout);
                            info.resolve(msg);
                            this.messageRegistry = this.messageRegistry.filter((item) => {
                                return item.responseId !== msg.responseId;
                            });
                        }
                    });
                }
                this.listeners.forEach((listener) => {
                   listener.onMessage(msg); 
                });
            });
            this.connection = connection;
        });

        this.ws.connect("ws://"+process.env.HARBOR_URL+":"+process.env.HARBOR_PORT);


    }

    public send(msg: IMessage) {
        this.connection.send(MessageBuilder.toMessage(msg).toString());
    }

    public answer(msg: IMessage, answer: IMessage) {
        answer.isResponse = true;
        answer.responseId = msg.responseId;
        this.connection.send(MessageBuilder.toMessage(answer).toString());
    }

    public addListeners(param: IPierWSListener) {
        this.listeners.push(param)
    }

    startHeartbeat() {
        setInterval(() => {
            this.send(MessageBuilder.heartbeatMessage());
        }, 10000);
    }

    sendMessageWithResponse(msg: IMessage, timeout: number = 120000) {
        return new Promise<IMessage>((resolve, reject) => {
            const responseId = this.randomResponseId();
            msg.responseId = responseId;
            msg.waitForResponse = true;

            this.messageRegistry.push({
                responseId: responseId,
                resolve: resolve,
                reject: reject,
                timeout: setTimeout(() => {
                    reject(new Error("Timeout"));
                }, timeout)
            });
            this.send(msg);
        });
    }

    private randomResponseId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

}