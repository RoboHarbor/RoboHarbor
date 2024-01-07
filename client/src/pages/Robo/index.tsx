import { Button, Card, Col, Dropdown, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';

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

const TaskDetail = () => {
    // set pagetitle
    usePageTitle({
        title: 'Task Details',
        breadCrumbItems: [
            {
                path: 'apps/tasks/kanban',
                label: 'Tasks',
            },
            {
                path: 'apps/tasks/kanban',
                label: 'Task Details',
                active: true,
            },
        ],
    });

    return (
        <Row>
            <Col md={8}>
                <Card>
                    <Card.Body>
                        <Dropdown className="float-end" align="end">
                            <Dropdown.Toggle as="a" className="cursor-pointer card-drop">
                                <i className="mdi mdi-dots-vertical"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>Action</Dropdown.Item>
                                <Dropdown.Item>Anothther Action</Dropdown.Item>
                                <Dropdown.Item>Something Else</Dropdown.Item>
                                <Dropdown.Item>Separated link</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <div className="d-flex mb-3">
                            <img src={user2} alt="user" className="flex-shrink-0 me-3 rounded-circle avatar-md" />
                            <div className="flex-grow-1">
                                <h4 className="media-heading mt-0">Michael Zenaty</h4>
                                <span className="badge bg-danger">Urgent</span>
                            </div>
                        </div>

                        <h4>Code HTML email template for welcome email</h4>
                        <p className="text-muted">
                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
                            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint cupiditate
                            non sunt in culpa qui officia deserunt animi est laborum et
                        </p>
                        <p className="text-muted">
                            Consectetur adipisicing elit. Voluptates, illo, iste itaque voluptas corrupti ratione
                            reprehenderit magni similique Tempore quos delectus asperiores libero voluptas quod
                            perferendis erum ipsum dolor sit.
                        </p>

                        <Row className="task-dates mb-0 mt-2">
                            <Col lg={6}>
                                <h5 className="font-600 m-b-5">Start Date</h5>
                                <p>
                                    {' '}
                                    22 March 2016 <small className="text-muted">1:00 PM</small>
                                </p>
                            </Col>
                            <Col lg={6}>
                                <h5 className="font-600 m-b-5">Due Date</h5>
                                <p>
                                    {' '}
                                    17 April 2016 <small className="text-muted">12:00 PM</small>
                                </p>
                            </Col>
                        </Row>

                        <div className="task-tags mt-2">
                            <h5>Tags</h5>
                            <Select
                                isMulti={true}
                                options={[
                                    { value: 'amsterdam', label: 'Amsterdam' },
                                    { value: 'washington', label: 'Washington' },
                                    { value: 'sydney', label: 'Sydney' },
                                ]}
                                defaultValue={{ value: 'amsterdam', label: 'Amsterdam' }}
                                className="react-select react-select-container"
                                classNamePrefix="react-select"
                            ></Select>
                        </div>

                        <div className="assign-team mt-3">
                            <h5>Assign to</h5>
                            <div>
                                <Link to="#">
                                    <img className="rounded-circle avatar-sm" alt="user" src={user2} />
                                </Link>
                                <Link to="#">
                                    <img className="rounded-circle avatar-sm" alt="user" src={user3} />
                                </Link>
                                <Link to="#">
                                    <img className="rounded-circle avatar-sm" alt="user" src={user5} />
                                </Link>
                                <Link to="#">
                                    <img className="rounded-circle avatar-sm" alt="user" src={user8} />
                                </Link>
                                <Link to="#">
                                    <span className="add-new-plus">
                                        <i className="mdi mdi-plus"></i>
                                    </span>
                                </Link>
                            </div>
                        </div>

                        <div className="attached-files mt-3">
                            <h5>Attached Files </h5>
                            <ul className="list-inline files-list">
                                <li className="list-inline-item file-box">
                                    <Link to="#">
                                        <img
                                            src={img1}
                                            className="img-fluid img-thumbnail"
                                            alt="attached-img"
                                            width="80"
                                        />
                                    </Link>
                                    <p className="font-13 mb-1 text-muted">
                                        <small>File one</small>
                                    </p>
                                </li>
                                <li className="list-inline-item file-box">
                                    <Link to="#">
                                        <img
                                            src={img2}
                                            className="img-fluid img-thumbnail"
                                            alt="attached-img"
                                            width="80"
                                        />
                                    </Link>
                                    <p className="font-13 mb-1 text-muted">
                                        <small>Attached-2</small>
                                    </p>
                                </li>
                                <li className="list-inline-item file-box">
                                    <Link to="#">
                                        <img
                                            src={img3}
                                            className="img-fluid img-thumbnail"
                                            alt="attached-img"
                                            width="80"
                                        />
                                    </Link>
                                    <p className="font-13 mb-1 text-muted">
                                        <small>Dribbble shot</small>
                                    </p>
                                </li>
                                <li className="list-inline-item file-box ms-2">
                                    <div className="fileupload add-new-plus">
                                        <span>
                                            <i className="mdi-plus mdi"></i>
                                        </span>
                                        <input type="file" className="upload" />
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <Row>
                            <Col sm={12}>
                                <div className="text-end">
                                    <Button type="submit" variant="success" className="waves-effect waves-light me-1">
                                        Save
                                    </Button>
                                    <Button variant="light" className="waves-effect">
                                        Cancle
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card>
                    <Card.Body>
                        <Dropdown className="float-end" align="end">
                            <Dropdown.Toggle as="a" className="cursor-pointer card-drop">
                                <i className="mdi mdi-dots-vertical"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>Action</Dropdown.Item>
                                <Dropdown.Item>Anothther Action</Dropdown.Item>
                                <Dropdown.Item>Something Else</Dropdown.Item>
                                <Dropdown.Item>Separated link</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <h4 className="header-title mt-0 mb-3">Comments (6)</h4>
                        <div>
                            <div className="d-flex mb-3">
                                <div className="flex-shrink-0 me-3">
                                    <Link to="#">
                                        <img src={user1} alt="user" className="rounded-circle avatar-sm" />
                                    </Link>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="mt-0">Mat Helme</h5>
                                    <p className="font-13 text-muted mb-0">
                                        <Link to="#" className="text-primary">
                                            @Michael
                                        </Link>{' '}
                                        Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                                        sollicitudin commodo.
                                    </p>
                                    <Link to="#" className="text-success font-13">
                                        Reply
                                    </Link>
                                </div>
                            </div>
                            <div className="d-flex mb-3">
                                <div className="flex-shrink-0 me-3">
                                    <Link to="#">
                                        <img src={user2} alt="user" className="rounded-circle avatar-sm" />
                                    </Link>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="mt-0">Media heading</h5>
                                    <p className="font-13 text-muted mb-0">
                                        <Link to="#" className="text-primary">
                                            @Michael
                                        </Link>{' '}
                                        Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                                        sollicitudin commodo.
                                    </p>
                                    <Link to="#" className="text-success font-13">
                                        Reply
                                    </Link>
                                    <div className="d-flex my-2">
                                        <div className="flex-shrink-0 me-3">
                                            <Link to="#">
                                                <img src={user3} alt="user" className="rounded-circle avatar-sm" />
                                            </Link>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="mt-0">Nested media heading</h5>
                                            <p className="font-13 text-muted mb-0">
                                                <Link to="#" className="text-primary">
                                                    @Michael
                                                </Link>{' '}
                                                Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                                                ante sollicitudin commodo.
                                            </p>
                                            <Link to="#" className="text-success font-13">
                                                Reply
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex mb-3">
                                <div className="flex-shrink-0 me-3">
                                    <Link to="#">
                                        <img src={user1} alt="user" className="rounded-circle avatar-sm" />
                                    </Link>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="mt-0">Mat Helme</h5>
                                    <p className="font-13 text-muted mb-0">
                                        <Link to="#" className="text-primary">
                                            @Michael
                                        </Link>{' '}
                                        Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                                        sollicitudin commodo.
                                    </p>
                                    <Link to="#" className="text-success font-13">
                                        Reply
                                    </Link>
                                </div>
                            </div>
                            <div className="d-flex mb-3">
                                <div className="flex-shrink-0 me-3">
                                    <Link to="#">
                                        <img src={user1} alt="user" className="rounded-circle avatar-sm" />
                                    </Link>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="mt-0">Mat Helme</h5>
                                    <p className="font-13 text-muted mb-0">
                                        <Link to="#" className="text-primary">
                                            @Michael
                                        </Link>{' '}
                                        Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                                        sollicitudin commodo.
                                    </p>
                                    <Link to="#" className="text-success font-13">
                                        Reply
                                    </Link>
                                </div>
                            </div>
                            <div className="d-flex mb-3">
                                <div className="flex-shrink-0 me-3">
                                    <Link to="#">
                                        <img src={user1} alt="user" className="rounded-circle avatar-sm" />
                                    </Link>
                                </div>
                                <div className="flex-grow-1">
                                    <input type="text" className="form-control" placeholder="Some text value..." />
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default TaskDetail;
