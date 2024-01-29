import {useEffect, useState} from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// hooks

// component

// data
import {usePageTitle} from "../../hooks";
import {FormInput, VerticalForm} from "../../components/form";
import PierDetails from "../../components/PierDetails";
import {IPier} from "../../../../src/models/pier/types";
import {getAll} from "../../helpers/api/pier";


const List = () => {
    // set pagetitle
    usePageTitle({
        title: 'All your Piers',
        breadCrumbItems: [

        ],
    });

    const [piers, setPiers] = useState<IPier[]>([]);
    const [modal, setModal] = useState<boolean>(false);

    const reloadPiers = () => {
        getAll().then((res) => {
            setPiers(res.data);
        });
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            reloadPiers();
        }, 15000);
        reloadPiers();
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <Row>
                {(piers || []).map((pier, index) => {
                    return (
                        <Col xl={4} md={6} key={index.toString()}>
                            <PierDetails pier={pier} />
                        </Col>
                    );
                })}
            </Row>
        </>
    );
};

export default List;
