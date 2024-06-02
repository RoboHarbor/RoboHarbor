import {useEffect, useState} from "react";
import sadRobot from "../../assets/images/robot/sad_robot.png";
import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

const RoboArguments = (props: {bot: any, onChange: (config: any, bot: any) => void}) => {

    const [robotArguments, setRobotArguments] = useState<any>(props.bot?.robotContent ? props.bot?.robotContent : null);
    const [robotContentValues, setRobotContentValues] = useState<any>(props.bot?.robotContentValues ? props.bot?.robotContentValues : null);

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
                            File in your repository. Create one and see the values here. <a href={"https://rjsf-team.github.io/react-jsonschema-form/"}>(Generate a RObot File here)</a></h5>
                    </div>
                </div>
            </div>}
        {
            robotArguments && <div>
                <pre>
                    <Form schema={robotArguments.jsonSchema}
                            uiSchema={robotArguments.uiSchema}
                            formData={robotContentValues}
                            onChange={(e) => {
                              if (e && e.formData) {
                                  props.onChange(e.formData, props.bot);
                              }
                            }}
                            children={true}
                            validator={validator} />
                </pre>
            </div>
        }
    </div>
}

export default RoboArguments;