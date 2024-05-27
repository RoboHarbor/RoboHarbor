import { Link } from 'react-router-dom';
import { Badge, Card, Col, OverlayTrigger, ProgressBar, Row, Tooltip } from 'react-bootstrap';
import classNames from 'classnames';

// hooks
import { usePageTitle } from '../../hooks';

// components
import { FormInput } from '../../components/form';


// dummy data
import {useEffect, useState} from "react";
import CreateSwarmModal from "../../components/modals/CreateSwarmModal";


const Fleets = () => {
    // set pagetitle
    usePageTitle({
        title: 'Fleets',
        breadCrumbItems: [

        ],
    });

    const [createModalOpen, setCreateModalOpen] = useState(false);



    return (
        <>
            <Row>
                <Col sm={4}>
                    <Link onClick={() => setCreateModalOpen(true)} to="#" className="btn btn-purple rounded-pill w-md waves-effect waves-light mb-3">
                        <i className="mdi mdi-plus me-1"></i>
                        Create New Fleet of Robots
                    </Link>
                </Col>
            </Row>
            {createModalOpen && <CreateSwarmModal onSwarmCreated={() => setCreateModalOpen(false)}
                                                  open={createModalOpen}
                                                  onClose={() => setCreateModalOpen(false)}/>}
        </>
    );
};

export default Fleets;
