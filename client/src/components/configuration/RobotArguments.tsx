import {useEffect, useState} from "react";
import sadRobot from "../../assets/images/robot/sad_robot.png";

const RoboArguments = (props: {bot: any, onChange: (config: any, bot: any) => void}) => {

    const [robotArguments, setRobotArguments] = useState<any>(props.bot?.roboArguments || null);
    const [config, setConfig] = useState<any>(props.bot?.config?.robotValues || {});

    useEffect(() => {

    }, [])

    return <div className={"bg-light p-2  mb-2"}>
        <h4>Robot Arguments</h4>

            {!robotArguments && <div className={"row"}>
                <div className={"col-3 text-center p-3"}>
                    <img src={sadRobot} style={{width: "100%", maxWidth: "100px"}} />
                </div>
                <div className={"col-9 align-self-center"}>
                    <div className={"alert alert-danger"}>
                        <h4 className={"fg-danger"}>No robot arguments found</h4>
                        <h5>Normally you can configure your robot with a easy user interface here. But we have not found a ".robot"
                            File in your repository. Create one and see the values here. <a href={"#"}>(Read more here)</a></h5>
                    </div>
                </div>
            </div>}
    </div>
}

export default RoboArguments;