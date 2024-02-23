import {useEffect, useState} from "react";

const EnvironmentVariablesConfiguration = (props: {bot: any, onChange: (config: any, bot: any) => void}) => {

        const [config, setConfig] = useState<any>(props.bot?.runner?.config?.env || {});

        useEffect(() => {

        }, [])

        return <div className={"bg-light p-2  mb-2"}>
            <h4>Environment Variables</h4>
            <div className={"row"}>
                <div className={"col-6"}>
                    <label>Key</label>
                </div>
                <div className={"col-6"}>
                    <label>Value</label>
                </div>
            </div>
            {Object.keys(config).map((key) => {
                return <div className={"row mb-3"}>
                    <div className={"col-5 col-md-5 col-sm-12"}>
                        <input className={"form-control"} value={key} onChange={(e) => {
                            const newConfig = {
                                ...config,
                                [e.target.value]: config[key]
                            }
                            delete newConfig[key];
                            setConfig(newConfig);
                            props.onChange(newConfig, props.bot);
                        }}/>
                    </div>
                    <div className={"col-6 col-md-6 col-sm-10"}>
                        <input className={"form-control"} value={config[key]} onChange={(e) => {
                            setConfig({
                                ...config,
                                [key]: e.target.value
                            });
                            props.onChange({
                                ...config,
                                [key]: e.target.value
                            }, props.bot);
                        }}/>
                    </div>
                    <div className={"col-1 col-md-1 col-sm-2"}>
                        <button className={"btn btn-danger"} type={"button"} onClick={() => {
                            const newConfig = {
                                ...config
                            }
                            delete newConfig[key];
                            setConfig(newConfig);
                            props.onChange(newConfig, props.bot);
                        }} ><i className={"fa fa-trash"} /> </button>
                    </div>
                </div>
            })}
            <div className={"row"}>
                <div className={"col-6"}>
                    <button className={"btn btn-primary"} type={"button"} onClick={() => {
                        const newConfig = {
                            ...config,
                            [""]: ""
                        }
                        setConfig(newConfig);
                        props.onChange(newConfig, props.bot);
                    }} >Add new Variable</button>
                </div>
            </div>

        </div>
}

export default EnvironmentVariablesConfiguration;