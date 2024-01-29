import {Form} from "react-bootstrap";
import {useState} from "react";

export interface IProperty {
    values?:  {value: string, label: string }[];
    type: string;
    name: string;
}

export interface PropertyEditorProps {
    properties: IProperty[] | undefined,
    onChange: (values: any) => void;
    values: any;
}

const PropertyEditor = (props: PropertyEditorProps) => {

    const [config, setConfig] = useState<any>(props.values || {});


    return <div>
        {props.properties?.map((attribute) => {

            if (attribute.type === "select" || attribute.type == "enum") {
                return  <Form.Select
                    key={attribute.name}
                    placeholder={attribute.name}
                    title={attribute.name}
                    value={config[attribute.name] }
                    onChange={(e) => {
                        setConfig({
                            ...config,
                            [attribute.name]: e.target.value
                        })
                        props.onChange({
                            ...props.values,
                            [attribute.name]: e.target.value
                        });
                    }}
                >
                    {attribute.values?.map((option: {label: string, value: string}) => {
                        return <option key={option.value} value={option.value}>{option.label}</option>
                    })}
                </Form.Select>
            }


            return <Form.Control
                key={attribute.name}
                title={attribute.name}
                type={attribute.type}
                placeholder={attribute.name}
                value={props.values ? props.values[attribute.name] : null}
                onChange={(e) => {
                    setConfig({
                        ...config,
                        [attribute.name]: e.target.value
                    })
                    props.onChange({
                        ...props.values,
                        [attribute.name]: e.target.value
                    });
                }}
            />
        })}
    </div>
}

export default PropertyEditor;