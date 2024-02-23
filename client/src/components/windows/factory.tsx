import React from "react";
import RobotControlWindow from "./robotcontrol/RobotControlWindow";
import RobotLogViewWindow from "./robotlogs/RobotLogViewWindow";

const factory = (node: any, relevantProps: any) => {
    var component = node.getComponent();
    const id = node.getId();


    if (component === "button") {
        return <button key={"comp"+id} >{node.getName()}</button>;
    }
    else if (component === "robotcontrol") {
        return <RobotControlWindow key={"comp"+id}  {...relevantProps} />;
    }
    else if (component === "robotlog") {
        return <RobotLogViewWindow key={"comp"+id} {...relevantProps} />;
    }
}

export default factory;