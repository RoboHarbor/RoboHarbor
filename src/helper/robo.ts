import {Robot} from "../db/robot";
import {IRobot} from "../models/robot/types";

export const cleanRobotData = (robot: IRobot) : IRobot => {
    return {
        id: robot.id,
        name: robot.name,
        source: robot.source,
        sourceInfo: robot.sourceInfo ? {
            sourceVersion: robot.sourceInfo.sourceVersion,
            localVersion: robot.sourceInfo.localVersion,
            } : null,
        runner: robot.runner,
        config: robot.config,
        type: robot.type,
        enabled: robot.enabled,
        identifier: robot.identifier
    };
}