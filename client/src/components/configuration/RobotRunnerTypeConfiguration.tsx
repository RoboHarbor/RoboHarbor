import {Button, Col, Form, Row} from "react-bootstrap";
import {IRunnerPackage} from "../../../../src/models/harbor/types";
import {useEffect, useState} from "react";
import {getRunnerPackages} from "../../helpers/api/harbor";
import _ from "lodash";

export interface RobotRunnerTypeConfigurationProps{
    bot?: any;
    setBotValue: (key: string, value: any) => void;
    previous: () => void;
    next: () => void;
    possibleRunners?: IRunnerPackage[];

}

const RobotRunnerTypeConfiguration = ({bot, setBotValue, next, previous, possibleRunners}: RobotRunnerTypeConfigurationProps) => {
    const [runnerPackages, setRunnerPackages] = useState<IRunnerPackage[]>([]);

    useEffect(() => {
        getRunnerPackages()
            .then((data) => {
                setRunnerPackages(data.data);
            });
    }, [])


    const sortByPossibleRunners = (a: IRunnerPackage, b: IRunnerPackage) => {
        if (possibleRunners && possibleRunners.length > 0) {
            if (possibleRunners.find((r) => r.name === a.name)) {
                return -1;
            }
            if (possibleRunners.find((r) => r.name === b.name)) {
                return 1;
            }
        }

        return 0;
    }

    const isValue = (key: string, value: any) => {
        return _.get(bot, key) === value;
    }

    const hasValue = (key: string) => {
        return _.get(bot, key);
    }


    return (<Form>
        <Row className={"bg-light"}>
            <Col sm={12} className={"text-center"}>
                <input className={"searchbar bg-light"} style={{maxWidth: "250px"}} type={"text"} name={"searchRunner"} placeholder={"Search runner..."} />
            </Col>
            <Col sm={12} className={"d-flex flex-row overflow-auto"}>
                {runnerPackages.sort(sortByPossibleRunners).map((runnerPackage: IRunnerPackage) => {
                    return <div onClick={() => setBotValue("runner.type", runnerPackage.name)}
                                className={"card-width-220 justify-content-center text-center  card m-2 nomargin card-body card-hoverable "+(isValue("runner.type", runnerPackage.name) ? "card-hoverable-selected" : "")}>
                        <div className={"align-content-center mb-3"}><img style={{maxWidth: "50px", maxHeight: "50px"}} src={runnerPackage.logo} /></div>
                        <h4  className="card-title">{runnerPackage.title}</h4>
                    </div>
                })}
            </Col>
        </Row>
        <ul className="pager wizard mb-0 list-inline">
            <li className="previous list-inline-item">
                <Button
                    onClick={() => {
                        previous();
                    }}
                    variant="secondary"
                >
                    Previous
                </Button>
            </li>
            <li className="next list-inline-item float-end">
                <Button onClick={() => next()} variant="secondary">Next</Button>
            </li>
        </ul>
    </Form>);
}

export default RobotRunnerTypeConfiguration;