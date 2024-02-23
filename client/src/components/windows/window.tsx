import {IRobot} from "../../../../src/models/robot/types";

export interface IWindowProps{
    robot: IRobot,
    swal: any,
    reloadRobotShort: () => void,
}