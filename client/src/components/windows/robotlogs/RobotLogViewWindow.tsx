import React, {useEffect, useState} from "react";
import {IWindowProps} from "../window";
import LogView from "../../log/LogView";

export interface IRobotLogViewWindowProps extends IWindowProps {

}

const RobotLogViewWindow = ({robot, reloadRobotShort}: IRobotLogViewWindowProps) => {

    const [reloading, setReloading] = useState<boolean>(false);



    return  <LogView robotId={robot?.id} reload={() => {



        }} />;
}

export default RobotLogViewWindow;