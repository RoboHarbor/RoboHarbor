import {useEffect, useState} from "react";

const CustomArguments = (props: {bot: any, onChange: (config: any, bot: any) => void}) => {

    const [config, setConfig] = useState<any>(props.bot?.image?.config?.arguments || {});

    useEffect(() => {

    }, [])

    return <div className={"bg-light p-2  mb-2"}>
        <h4>Custom Arguments</h4>
        <div className={"row"}>
            <div className={"col-6"}>
                <label>Key</label>
            </div>
            <div className={"col-6"}>
                <label>Value</label>
            </div>
        </div>
        {config?.entries?.map((entry: any, index: number) => {
            return <div className={"row mb-3"}>
                <div className={"col-5 col-md-5 col-sm-12"}>
                    <input className={"form-control"} value={entry.key} onChange={(event) => {
                        const newConfig = {
                            ...config,
                            entries: config.entries.map((e: any, i: number) => {
                                if (i === index) {
                                    return {
                                        ...e,
                                        key: event.target.value
                                    }
                                }
                                return e;
                            })
                        }
                        setConfig(newConfig);
                        props.onChange(newConfig, props.bot);
                    }}/>
                </div>
                <div className={"col-6 col-md-6 col-sm-10"}>
                    <input className={"form-control"} value={entry.value} onChange={(event) => {
                        const newConfig = {
                            ...config,
                            entries: config.entries.map((e: any, i: number) => {
                                if (i === index) {
                                    return {
                                        ...e,
                                        value: event.target.value
                                    }
                                }
                                return e;
                            })
                        }
                        setConfig(newConfig);
                        props.onChange(newConfig, props.bot);
                    }}/>
                </div>
                <div className={"col-1 col-md-1 col-sm-2"}>
                    <button className={"btn btn-danger"} type={"button"} onClick={() => {
                        const newConfig = {
                            ...config,
                            entries: config.entries.filter((e: any, i: number) => i !== index)
                        }
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
                        entries: [
                            ...(config.entries || []),
                            {
                                key: "",
                                value: ""
                            }
                        ]
                    }
                    setConfig(newConfig);
                    props.onChange(newConfig, props.bot);
                }} >Add new Variable</button>
            </div>
        </div>

    </div>
}

export default CustomArguments;