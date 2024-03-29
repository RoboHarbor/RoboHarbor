import { Link } from 'react-router-dom';
import { Badge, Card, Col, OverlayTrigger, ProgressBar, Row, Tooltip } from 'react-bootstrap';
import classNames from 'classnames';

// hooks
import { usePageTitle } from '../../hooks';

// components
import { FormInput } from '../../components/form';

// types
import { ProjectsList } from './types';

// dummy data
import {IPier} from "../../../../src/models/pier/types";
import {useEffect, useState} from "react";
import {getAll} from "../../helpers/api/pier";
import CreateRobotModal from "../../components/modals/CreateRobotModal";
import {IRobot} from "../../../../src/models/robot/types";
import {getRobots} from "../../helpers/api/robots";

type AllRobotsOverviewProps = {
    robots: IRobot[];
};

const AllRobotsOverview = ({ robots }: AllRobotsOverviewProps) => {
    return (
        <Row>
            {(robots || []).map((robot, index) => {
                return (
                    <Col xl={4} key={index.toString()}>
                        <Card>
                            <Card.Body className="project-box">
                                <Badge  className="float-end">

                                </Badge>
                                <h4 className="mt-0">
                                    <Link to={"/harbor/robots/"+robot.id?.toString()} className="text-dark">
                                        {robot.name}
                                    </Link>
                                </h4>
                                <p className={classNames('text-', 'text-uppercase', 'font-13')}>

                                </p>
                                <p className="text-muted font-13">

                                    <Link to="#" className="text-primary">
                                        View more
                                    </Link>
                                </p>

                                <ul className="list-inline">
                                    <li className="list-inline-item me-4">
                                        <h4 className="mb-0"></h4>
                                        <p className="text-muted">Questions</p>
                                    </li>
                                    <li className="list-inline-item">
                                        <h4 className="mb-0"></h4>
                                        <p className="text-muted">Comments</p>
                                    </li>
                                </ul>

                                <div className="project-members mb-2">
                                    <h5 className="float-start me-3">Team :</h5>
                                    <div className="avatar-group">
                                        {( []).map((member: any, index) => {
                                            return (
                                                <OverlayTrigger
                                                    key={index.toString()}
                                                    placement="bottom"
                                                    overlay={<Tooltip id={member.name}>{member.name}</Tooltip>}
                                                >
                                                    <Link to="#" className="avatar-group-item">
                                                        <img
                                                            src={member.image}
                                                            className="rounded-circle avatar-sm"
                                                            alt=""
                                                        />
                                                    </Link>
                                                </OverlayTrigger>
                                            );
                                        })}
                                    </div>
                                </div>

                                <h5 className="mb-2 fw-semibold">
                                    Progress
                                    <span className={classNames('float-end', 'text-')}>
                                        %
                                    </span>
                                </h5>
                                <ProgressBar
                                    className={classNames('progress-bar-alt-' , 'progress-sm')}
                                >
                                    <ProgressBar
                                        variant={""}
                                        now={0}
                                        className="progress-animated"
                                    />
                                </ProgressBar>
                            </Card.Body>
                        </Card>
                    </Col>
                );
            })}
        </Row>
    );
};

const Projects = () => {
    // set pagetitle
    usePageTitle({
        title: 'Robots',
        breadCrumbItems: [
            {
                path: 'port',
                label: 'Robots',
                active: true,
            },
        ],
    });

    const [piers, setPiers] = useState<IPier[]>([]);
    const [robots, setRobots] = useState<IRobot[]>([]);
    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

    const onRobotCreated = () => {
        setCreateModalOpen(false);
        reloadRobots();
    }

    const reloadRobots = () => {
        getRobots().then((res) => {
            setRobots(res.data);
        });
    }

    const reloadPiers = () => {
        getAll().then((res) => {
            setPiers(res.data);
        });
    }

    useEffect(() => {
        reloadPiers();
        reloadRobots();
        setTimeout(() => {
            reloadRobots();
        }, 5000);
    }, []);

    return (
        <>
            <Row>
                <Col sm={4}>
                    <Link onClick={() => setCreateModalOpen(true)} to="#" className="btn btn-purple rounded-pill w-md waves-effect waves-light mb-3">
                        <i className="mdi mdi-plus me-1"></i>
                        Create New Robot / App
                    </Link>
                </Col>
                <Col sm={8}>
                    <div className="float-end">
                        <form className="row g-2 align-items-center mb-2 mb-sm-0">
                            <div className="col-auto">
                                <div className="d-flex">
                                    <label className="d-flex align-items-center">
                                        Piers
                                        <FormInput
                                            type="select"
                                            name="phase"
                                            containerClass="d-inline-block ms-2"
                                            className="form-select-sm"
                                        >
                                            <option>All Piers ({piers.length})</option>
                                            {(piers || []).map((pier, index) => {
                                                return (
                                                    <option key={index.toString()}>{pier.identifier}</option>
                                                );
                                            })}
                                        </FormInput>
                                    </label>
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="d-flex">
                                    <label className="d-flex align-items-center">
                                        Sort
                                        <FormInput
                                            type="select"
                                            name="sort"
                                            containerClass="d-inline-block ms-2"
                                            className="form-select-sm"
                                        >
                                            <option>Date</option>
                                            <option>Name</option>
                                            <option>End date</option>
                                            <option>Start Date</option>
                                        </FormInput>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                </Col>
            </Row>
            <AllRobotsOverview robots={robots} />
            {createModalOpen && <CreateRobotModal onClose={() => onRobotCreated()} open={true} />}
        </>
    );
};

export default Projects;
