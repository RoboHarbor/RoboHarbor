import { Link } from 'react-router-dom';
import { Badge, Card, Col, OverlayTrigger, ProgressBar, Row, Tooltip } from 'react-bootstrap';
import classNames from 'classnames';

// hooks
import { usePageTitle } from '../../hooks';


// dummy data
import {useEffect, useState} from "react";


const SystemSettings = () => {
    // set pagetitle
    usePageTitle({
        title: 'System Settings',
        breadCrumbItems: [

        ],
    });



    return (
        <>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Body>
                            <h4 className="card-title mb-4">User  Account Settings</h4>
                            <div className="mb-4">
                                <h5 className="font-size-14 mb-3">Allowance of register on this instance</h5>
                                <div className="form-check form-switch mb-3">
                                    <input type="checkbox" className="form-check-input" id="customSwitch1" defaultChecked />
                                    <label className="form-check-label" htmlFor="customSwitch1">Allow register</label>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <div className="text-end">
                                <button type="button" className="btn btn-primary waves-effect waves-light">Save</button>
                            </div>
                            
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default SystemSettings;
