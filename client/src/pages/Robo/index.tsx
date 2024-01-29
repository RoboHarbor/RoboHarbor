import { Button, Card, Col, Dropdown, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import {LazyLog} from 'react-lazylog';

// hooks
import { usePageTitle } from '../../hooks';

// images
import user1 from '../../assets/images/users/user-1.jpg';
import user2 from '../../assets/images/users/user-2.jpg';
import user3 from '../../assets/images/users/user-3.jpg';
import user5 from '../../assets/images/users/user-5.jpg';
import user8 from '../../assets/images/users/user-8.jpg';

import img1 from '../../assets/images/attached-files/img-1.jpg';
import img2 from '../../assets/images/attached-files/img-2.jpg';
import img3 from '../../assets/images/attached-files/img-3.jpg';
import {IRobot} from "../../../../src/models/robot/types";
import {useEffect, useState} from "react";
import {getRobot, runRobot, stopRobot} from "../../helpers/api/robots";
import Loader from "../../components/Loader";
import LogView from "../../components/log/LogView";
import CreateRobotModal from "../../components/modals/CreateRobotModal";

const TaskDetail = () => {
    // set pagetitle
    usePageTitle({
        title: 'Robot Details',
        breadCrumbItems: [
            {
                path: 'harbor/robots/',
                label: 'Robot Details',
            },
        ],
    });

    const [robot, setRobot] = useState<IRobot | null>(null);
    const [showEdit, setShowEdit] = useState<boolean>(false);

    const reloadRobotShort = () => {
        setTimeout(() => {
            reloadRobot();
        }, 1000);
    }

    const reloadRobot = () => {
        if (showEdit) return;

        const robotId = window.location.pathname.split('/')[3];

        getRobot(`${robotId}`)
            .then((data) => {
                setRobot(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const run = () => {
        const robotId = window.location.pathname.split('/')[3];

        runRobot(`${robotId}`)
        reloadRobotShort();
    }

    const stop = () => {
        const robotId = window.location.pathname.split('/')[3];

        stopRobot(`${robotId}`)
        reloadRobotShort();
    }

    const editRobot = () => {
        setShowEdit(true);
    }

    useEffect(() => {

       reloadRobot();
       const intervalId = setInterval(() => {
           reloadRobot();
       }, 2000);
        return () => clearInterval(intervalId);

    }, []);





    if (!robot) return (<Row>
            <Loader />
        </Row>
    );

    return (
        <Row>
            <Col md={8}>
                <Card>
                    <Card.Body>
                        {showEdit && <CreateRobotModal open={showEdit} onClose={() => {
                            setShowEdit(false);}} robot={robot} />}

                        <div className="d-flex mb-3">
                            <div className="flex-grow-1">
                                <h2 className="media-heading mt-0">{robot?.name}</h2>
                            </div>
                        </div>

                        <div className="d-flex mb-3">
                            <div className="flex-grow-1">
                                <Button disabled={robot.enabled} onClick={() => editRobot()} variant="secondary" className=""><i className={"fa fa-edit"} /></Button>
                                {robot.type == "forever" && !robot.enabled ? <Button onClick={() => run()} variant="primary" className=""><i className={"fa fa-play"} /></Button> : null}
                                {robot.type == "forever" && robot.enabled == true ? <Button onClick={() => stop()} variant="danger" className=""><i className={"fa fa-stop"} /></Button> : null}
                            </div>
                        </div>

                    </Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card>
                    <Card.Body>
                        <LogView robotId={robot?.id} />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default TaskDetail;
