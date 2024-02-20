import {Robot} from "../db/robot";
import {IRobot} from "../models/robot/types";

export const cleanRobotData = (robot: IRobot) : IRobot => {
    return {
        id: robot.id,
        name: robot.name,
        source: robot.source,
        runner: robot.runner,
        config: robot.config,
        type: robot.type,
        enabled: robot.enabled,
        identifier: robot.identifier
    };
}