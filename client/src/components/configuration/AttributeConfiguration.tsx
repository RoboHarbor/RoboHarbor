import {useEffect, useState} from "react";
import {IRunnerPackage} from "../../../../src/models/harbor/types";
import {getRunnerPackages} from "../../helpers/api/harbor";
import {Form} from "react-bootstrap";
import PropertyEditor, {IProperty} from "../properties/PropertyEditor";

const AttributeConfiguration = (props: {attributeConfig: any, bot: any, onChange: (config: any, bot: any) => void}) => {

    const [runnerPackages, setRunnerPackages] = useState<IRunnerPackage[]>([]);
    const [config, setConfig] = useState<any>(props.attributeConfig || {});

    useEffect(() => {
        getRunnerPackages()
            .then((data) => {
                setRunnerPackages(data.data);
            });
    }, [])

    const targetRunnerPackage = runnerPackages.find((runnerPackage) => {
        return runnerPackage.name === props.bot?.runner?.type;
    });

    if (!targetRunnerPackage) return <div>Runner not found</div>

    return <div className={"bg-light p-2 mb-2"}>
        <h4>{targetRunnerPackage?.title} Configuration</h4>
        <Form.Group>
            <label>Attribute</label>
            <PropertyEditor
                properties={targetRunnerPackage?.attributes?.map((attribute) => {
                    return {
                        ...attribute
                    } as IProperty
                })}
                values={config}
                onChange={(values) => {
                    setConfig({
                        ...config,
                        ...values
                    });
                    props.onChange({
                        ...config,
                        ...values
                    }, props.bot);
                }} />

        </Form.Group>

    </div>
}

export default AttributeConfiguration;