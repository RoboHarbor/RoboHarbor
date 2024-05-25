import {useEffect, useState} from "react";
import AttributeConfiguration from "./AttributeConfiguration";
import EnvironmentVariablesConfiguration from "./EnvironmentVariablesConfiguration";
import CustomArguments from "./CustomArguments";
import RoboArguments from "./RobotArguments";
import {IRobot} from "../../../../src/models/robot/types";

const ConfigurationContainer = (props: {bot: IRobot, onChange: (config: any, bot: any) => void}) => {

    const [config, setConfig] = useState<any>(props.bot?.config || {});

    useEffect(() => {

    }, [])


    return <div className={""}>
        <RoboArguments bot={props.bot} onChange={(config, bot) => {
            props.onChange({
                ...props.bot.image?.config,
                robotArguments: config
            }, props.bot);
        }} />

        <AttributeConfiguration attributeConfig={props.bot?.image?.config?.attributes} bot={props.bot}
                                onChange={(config, bot) => {
                                    props.onChange({
                                        ...props.bot.image?.config,
                                        attributes: config
                                    }, props.bot);
                                }}   />
        <EnvironmentVariablesConfiguration bot={props.bot} onChange={(config, bot) => {
            props.onChange({
                ...props.bot.image?.config,
                env: config
            }, props.bot);
        }} />
        <CustomArguments bot={props.bot} onChange={(config, bot) => {
            props.onChange({
                ...props.bot.image?.config,
                arguments: config
            }, props.bot);
        }} />

    </div>
}

export default ConfigurationContainer;