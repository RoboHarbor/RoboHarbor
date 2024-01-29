
import {useEffect, useState} from "react";
import {FollowRobotLogMessage, fromJSON, toJSON} from "../../models/log/types";

import {LazyLog, LineContentProps, ScrollFollow} from "react-lazylog";

export interface LogViewProps {
    robotId?: number;
}



const LogView = ({ robotId }: LogViewProps) => {

    const [logs, setLogs] = useState<any[]>([]);

    /*
    let ws : any = null;

    useEffect(() => {

        const reconnect = () => {
            // STart a websocket connection to the port 3333 with the id of the robot
            ws = new WebSocket(`ws://localhost:3333/${robotId}`);
            ws.onopen = () => {
                setTimeout(() => {
                    const data = new FollowRobotLogMessage(robotId);
                    ws.send(toJSON(data));
                }, 300);
            }

            ws.onmessage = (event: any) => {
                setLogs((logs) => [...logs, fromJSON(event.data)]);
            }

            ws.onclose = () => {
                reconnect();
            }

        }
        if (typeof robotId !== "undefined" && ws === null) {
            reconnect();
        }

        return () => {
            if (ws) {
                ws.close();
            }
        }
    }, [robotId]);
*/
    if (!robotId ) return (<div></div>);

    const dateFormat = (date: Date) => {
        return date.toLocaleDateString()+" "+date.toLocaleTimeString();
    }
    const replaceLastNL = (text: string) => {
        return text.replace(/\n$/, "");
    }

    return (
        <div>
            <ScrollFollow
                startFollowing={true}
                render={({ follow, onScroll }) => (
                    <LazyLog

                        websocket={true}
                        url={`ws://localhost:3333/${robotId}`}
                        websocketOptions={{
                            onOpen: (e, ws) => {
                                setTimeout(() => {
                                    const data = new FollowRobotLogMessage(robotId);
                                    ws.send(toJSON(data));
                                }, 300);
                            },
                            formatMessage: (msg) => {
                                const log = fromJSON(msg);
                                return log.level+" - "+replaceLastNL(log.logs)+" - "+dateFormat(new Date(log.date));
                            }
                        }}
                        stream={true}
                        lineClassName={"log-line"}
                        height={500}
                        enableSearch={true}
                        selectableLines={true}
                        formatPart={(text: string | any) => {
                            if (text.startsWith("INFO")) {
                                return <span style={{color: "white"}}>{text}</span>;
                            }
                            if (text.startsWith("CRASH")) {
                                return <span style={{color: "pink"}}>{text}</span>;
                            }
                            if (text.startsWith("STOPPED")) {
                                return <span style={{color: "lawngreen"}}>{text}</span>;
                            }
                            if (text.startsWith("ERROR")) {
                                return <span style={{color: "red"}}>{text}</span>;
                            }
                            return <span style={{color: "white"}}>{text}</span>;
                        }}
                        follow={follow}
                        //@ts-ignore
                        onScroll={onScroll}
                    >
                    </LazyLog>)
                } />
        </div>
    );
}


export default LogView;