import {IRobot} from "../models/robot/types";
import {IRobotRunner} from "./RobotRunner";
import ShellRobotRunner from "./runner/ShellRobotRunner";
import {RoboHarborError} from "../errors/RoboHarborError";
import PythonRobotRunner from "./runner/PythonRobotRunner";
import NodeRobotRunner from "./runner/NodeRobotRunner";

export default class RobotFactory {

    public static generateRobotRunner(robot: IRobot): any {
        const type = robot.runner?.type;
        if (type && type === "shell") {
            return ShellRobotRunner;
        }
        else if (type && type === "docker") {
            // return new DockerRobotRunner(this, robot);
        }
        else if (type && type === "node") {
            return NodeRobotRunner;
        }
        else if (type && type === "python") {
             return PythonRobotRunner;
        }
        throw new RoboHarborError(117, "Robot runner type not found");
    }
}