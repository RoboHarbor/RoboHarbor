import {useEffect, useState} from "react";
import {IRunnerPackage} from "../../../../src/models/harbor/types";
import {getRunnerPackages} from "../../helpers/api/harbor";
import {Form} from "react-bootstrap";
import AttributeConfiguration from "./AttributeConfiguration";
import EnvironmentVariablesConfiguration from "./EnvironmentVariablesConfiguration";
import CustomArguments from "./CustomArguments";
import RoboArguments from "./RobotArguments";

const ConfigurationContainer = (props: {bot: any, onChange: (config: any, bot: any) => void}) => {

    const [config, setConfig] = useState<any>(props.bot?.runner?.config || {});

    useEffect(() => {

    }, [])


    return <div className={""}>
        <RoboArguments bot={props.bot} onChange={(config, bot) => {
            props.onChange({
                ...props.bot.runner?.config,
                robotArguments: config
            }, props.bot);
        }} />

        <AttributeConfiguration attributeConfig={props.bot?.runner?.config?.attributes} bot={props.bot}
                                onChange={(config, bot) => {
                                    props.onChange({
                                        ...props.bot.config, attributes: config
                                    }, props.bot);
                                }}   />
        <EnvironmentVariablesConfiguration bot={props.bot} onChange={(config, bot) => {
            props.onChange({
                ...props.bot.config,
                env: config
            }, props.bot);
        }} />
        <CustomArguments bot={props.bot} onChange={(config, bot) => {
            props.onChange({
                ...props.bot.config,
                arguments: config
            }, props.bot);
        }} />

    </div>
}

export default ConfigurationContainer;