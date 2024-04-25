
import {useEffect, useState} from "react";
import {FollowRobotLogMessage, fromJSON, toJSON} from "../../models/log/types";

import {LazyLog, LineContentProps, ScrollFollow} from "react-lazylog";

export interface LogViewProps {
    robotId?: number;
    reload?: () => void;
}


const LogView = ({ robotId, reload }: LogViewProps) => {

    const [logs, setLogs] = useState<any[]>([]);
    const [followMode, setFollowMode] = useState<boolean>(true);
    const [scrollData, setScrollData] = useState<string>("");

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
                render={({ follow, onScroll, stopFollowing, startFollowing }) => {

                    return (

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
                            onClose: () => {
                                if (reload) {
                                    reload();
                                }
                            },
                            formatMessage: (msg) => {
                                const log = fromJSON(msg);
                                return log.level+" - "+replaceLastNL(log.logs)+" - "+dateFormat(new Date(log.date));
                            }
                        }}
                        stream={true}
                        extraLines={0}
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
                        text={scrollData}
                        follow={followMode}
                        // @ts-ignore
                        onScroll={(args: any) =>{
                            if (args.scrollTop < args.scrollHeight - args.clientHeight) {
                                stopFollowing();
                                setFollowMode(false);
                            } else {
                                startFollowing();
                                setFollowMode(true);
                            }
                        }}
                    >
                    </LazyLog>)}
                } />
        </div>
    );
}


export default LogView;