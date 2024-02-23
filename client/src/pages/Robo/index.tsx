import { Button, Card, Col, Dropdown, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { withSwal } from 'react-sweetalert2';
import {LazyLog} from 'react-lazylog';
import {Layout, Model} from 'flexlayout-react';
import 'flexlayout-react/style/light.css';

// hooks
import {usePageTitle, useRedux} from '../../hooks';

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
import React, {useCallback, useEffect, useState} from "react";
import {deleteRobot, getRobot, runRobot, stopRobot, updateRobotApi} from "../../helpers/api/robots";
import Loader from "../../components/Loader";
import LogView from "../../components/log/LogView";
import CreateRobotModal from "../../components/modals/CreateRobotModal";
import SourceShortDetails from "../../components/source/SourceShortDetails";
import factory from "../../components/windows/factory";
import {changePageTitle} from "../../redux/pageTitle/actions";
import {useInterval} from "../../useInterval";


const RoboDetail = withSwal((props: any) => {
    const [robot, setRobot] = useState<IRobot | null>(null);
    const [showAddNewWindow, setShowAddNewWindow] = useState<boolean>(false);
    const [lastInterval, setLastInterval] = useState<number>(new Date().getTime());
    const { swal } = props;
    const {dispatch} = useRedux();

    const updateWindowJson = (model: Model) => {
        if (robot) {
            updateRobotApi({
                id: robot.id,
                windowJson: model.toJson()
            });
        }
        setWindowJson(model.toJson());
    }

    const reloadRobot = () => {

        const robotId = window.location.pathname.split('/')[3];

        getRobot(`${robotId}`)
            .then((data) => {

                if (!robot || robot?.updatedAt != data.updatedAt) {
                    setRobot(data);
                    if (data.windowJson) {
                        setWindowJson(data.windowJson);
                    }

                }

            })
            .catch((err) => {
                if (err.errorKey == 404) {
                    window.location.href = '/harbor';
                }
                console.log(err);
            });
    };

    useInterval(() => {
        reloadRobot();
    }, 2000);


    useEffect(() => {
        // set pagetitle
        dispatch(changePageTitle({
            title: robot ? robot?.name : "",
            actions: [
                <div><a href={""} onClick={(e) => {
                    setShowAddNewWindow(true);
                    e.preventDefault();
                    return false;
                }}><i className={"fa fa-plus"} /></a></div>
            ],
            breadCrumbItems: [
                {
                    path: 'harbor/robots/',
                    label: 'Robot Details',
                },
            ],
        }));
    }, [robot]);

    const [windowJson, setWindowJson] = useState<any>({
        global: {},
        borders: [],
        layout: {
            type: "row",
            weight: 100,
            children: [
                {
                    type: "tabset",
                    weight: 50,
                    children: [
                        {
                            type: "tab",
                            name: "One",
                            component: "robotlog",
                        }
                    ]
                },
                {
                    type: "tabset",
                    weight: 50,
                    children: [
                        {
                            type: "tab",
                            name: "Two",
                            component: "robotcontrol",
                        }
                    ]
                }
            ]
        }
    });
    const model = Model.fromJson(windowJson);

    const reloadRobotShort = () => {
        reloadRobot();
    }



    useEffect(() => {

       reloadRobot();

    }, []);


    if (!robot) return (<Row>
            <Loader />
        </Row>
    );

    return (
        <div style={{position: "relative", width: "100%", height: "100%"}}>
            <Layout
                model={model}
                onModelChange={(model) => {
                    updateWindowJson(model);
                }}

                factory={(node: any) => {
                    return factory(node, {
                        robot: robot,
                        swal: swal,
                        reloadRobotShort: reloadRobotShort,
                    });
                }} />
        </div>

    );
});

export default RoboDetail;
