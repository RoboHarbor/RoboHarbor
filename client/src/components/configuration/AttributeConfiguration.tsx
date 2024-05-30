import {useEffect, useState} from "react";
import {getRunnerPackages} from "../../helpers/api/harbor";
import {Form} from "react-bootstrap";
import PropertyEditor, {IProperty} from "../properties/PropertyEditor";
import {IRobot} from "../../../../src/models/robot/types";
import {IImage} from "../../models/pier/types";

const AttributeConfiguration = (props: {attributeConfig: any, bot: IRobot, onChange: (config: any, bot: any) => void}) => {

    const [config, setConfig] = useState<any>(props.attributeConfig || {});
    const [runnerPackages, setRunnerPackages] = useState<IImage[]>([]);

    useEffect(() => {
        getRunnerPackages()
            .then((data) => {
                setRunnerPackages(data.data);
            });
    }, []);

    const image : any = runnerPackages.find((image) => image.name === props.bot.image?.name);

    if (!image) {
        return <div></div>
    }

    return <div className={"bg-light p-2 mb-2"}>
        <h4>{image?.name} Configuration</h4>
        <Form.Group>
            <label>Attribute</label>
            <PropertyEditor
                properties={image?.attributes?.map((attribute: any) => {
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