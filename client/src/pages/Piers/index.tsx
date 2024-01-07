import { useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// hooks

// component

// data
import { contacts } from './data';
import {usePageTitle} from "../../hooks";
import {FormInput, VerticalForm} from "../../components/form";
import ContactDetails from "../../components/ContactDetails";

// dummy data

type MemberData = {
    name: string;
    position: string;
    company: string;
    email: string;
};

const List = () => {
    // set pagetitle
    usePageTitle({
        title: 'Contacts List',
        breadCrumbItems: [
            {
                path: '/apps/contacts/list',
                label: 'Contacts',
            },
            {
                path: '/apps/contacts/list',
                label: 'Contacts List',
                active: true,
            },
        ],
    });

    const [modal, setModal] = useState<boolean>(false);

    // Show/hide the modal
    const toggle = () => {
        setModal(!modal);
    };

    // form validation schema
    const schemaResolver = yupResolver(
        yup.object().shape({
            name: yup.string().required('Please enter name'),
            position: yup.string().required('Please enter your position'),
            company: yup.string().required('Please enter your company name'),
            email: yup.string().required('Please enter Email address').email('Enter valid email'),
        })
    );
    return (
        <>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="justify-content-center">
                                <Col md={4}>
                                    <div className="mt-3 mt-md-0">
                                        <Button variant="success" className="waves-effect waves-light" onClick={toggle}>
                                            <i className="mdi mdi-plus-circle me-1"></i>
                                            Add contact
                                        </Button>
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <form className="d-flex flex-wrap align-items-center justify-content-sm-end">
                                        <label className="me-2">Sort By</label>
                                        <FormInput type="select" name="sort">
                                            <option>All</option>
                                            <option>Name</option>
                                            <option>Post</option>
                                            <option>Followers</option>
                                            <option>Followings</option>
                                        </FormInput>
                                        <FormInput
                                            type="search"
                                            name="search"
                                            placeholder="Search..."
                                            className="ms-sm-2"
                                        />
                                    </form>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                {(contacts || []).map((contact, index) => {
                    return (
                        <Col xl={4} md={6} key={index.toString()}>
                            <ContactDetails contact={contact} />
                        </Col>
                    );
                })}
            </Row>
            <Modal show={modal} onHide={toggle} centered>
                <Modal.Header closeButton>
                    <Modal.Title as="h4">Add Contact</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <VerticalForm<MemberData> onSubmit={() => {}} resolver={schemaResolver} defaultValues={{}}>
                        <FormInput
                            label={'Name'}
                            type="text"
                            name="name"
                            placeholder="Enter name"
                            containerClass={'mb-3'}
                        />

                        <FormInput
                            label={'Position'}
                            type="text"
                            name="position"
                            placeholder="Enter position"
                            containerClass={'mb-3'}
                        />

                        <FormInput
                            label={'Company'}
                            type="text"
                            name="company"
                            placeholder="Enter company"
                            containerClass={'mb-3'}
                        />

                        <FormInput
                            label={'Email address'}
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            containerClass={'mb-3'}
                        />

                        <Button variant="light" className="waves-effect waves-light me-1" type="submit">
                            Save
                        </Button>
                        <Button variant="danger" className="waves-effect waves-light" onClick={toggle}>
                            Cancel
                        </Button>
                    </VerticalForm>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default List;
