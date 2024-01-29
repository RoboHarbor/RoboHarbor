import {IRobot} from "../../models/robot/types";
import SourceService from "./SourceService";
import GitSourceService from "./GitSourceService";
import DockerSourceService from "./DockerSourceService";
import ShellSourceService from "./ShellSourceService";
import {IRobotRunner} from "../RobotRunner";

export default class SourceFactory {

    static generateSourceService(runner: IRobotRunner, robot: IRobot): SourceService {
        switch (robot.source.type) {
            case "git":
                return new GitSourceService(robot, runner);
            case "docker":
                return new DockerSourceService(robot, runner);
            case "shell":
                return new ShellSourceService(robot, runner);
            default:
                throw new Error("No source service found for type: " + robot.source.type);
        }
    }
}