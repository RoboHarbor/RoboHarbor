import { Col, Container, Nav, Row, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// images
import img1 from '../../assets/images/landing/features-img/img-1.png';
import img2 from '../../assets/images/landing/features-img/img-2.png';
import img3 from '../../assets/images/landing/features-img/img-3.png';

const Feature = () => {
    return (
        <section className="features" id="features">
            <Container>
                <Row>
                    <Col lg={12}>
                        <Tab.Container defaultActiveKey="pills-customize-tab">
                            <Nav as="ul" variant="pills" justify className="features-tab mb-5">
                                <Nav.Item as="li">
                                    <Nav.Link as={Link} to="#" className="cursor-pointer" eventKey="pills-code-tab">
                                        <div className="clearfix">
                                            <div className="features-icon float-end">
                                                <h1>
                                                    <i className="pe-7s-notebook tab-icon"></i>
                                                </h1>
                                            </div>
                                            <div className="d-none d-lg-block me-4">
                                                <h5 className="tab-title">Quality Code</h5>
                                                <p>At vero eos et accusam et</p>
                                            </div>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <Nav.Link
                                        as={Link}
                                        to="#"
                                        className="cursor-pointer"
                                        eventKey="pills-customize-tab"
                                    >
                                        <div className="clearfix">
                                            <div className="features-icon float-end">
                                                <h1>
                                                    <i className="pe-7s-edit tab-icon"></i>
                                                </h1>
                                            </div>
                                            <div className="d-none d-lg-block me-4">
                                                <h5 className="tab-title">Easy to customize</h5>
                                                <p>Sed ut unde iste error sit</p>
                                            </div>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <Nav.Link as={Link} to="#" className="cursor-pointer" eventKey="pills-support-tab">
                                        <div className="features-icon float-end">
                                            <h1>
                                                <i className="pe-7s-headphones tab-icon"></i>
                                            </h1>
                                        </div>
                                        <div className="d-none d-lg-block me-4">
                                            <h5 className="tab-title">Awesome Support</h5>
                                            <p>It will be as simple as fact</p>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="pills-code-tab">
                                    <Row className="align-items-center justify-content-center">
                                        <Col lg={4} sm={6}>
                                            <img src={img1} alt="" className="img-fluid mx-auto d-block" />
                                        </Col>
                                        <Col lg={{ offset: 1, span: 6 }}>
                                            <div className="feature-icon mb-4">
                                                <h1>
                                                    <i className="pe-7s-notebook text-primary"></i>
                                                </h1>
                                            </div>
                                            <h5 className="mb-3">Quality Code</h5>
                                            <p className="text-muted">
                                                It will be as simple as Occidental in fact, it will be Occidental. To an
                                                English person it will seem like simplified English as a skeptical
                                                Cambridge.
                                            </p>
                                            <p className="text-muted">
                                                If several languages coalesce the grammar of the resulting language{' '}
                                            </p>
                                            <Row className="pt-4">
                                                <Col lg={6}>
                                                    <div className="text-muted">
                                                        <p>
                                                            <i className="mdi mdi-checkbox-marked-outline text-primary me-2 h6"></i>
                                                            Nemo enim ipsam quia
                                                        </p>
                                                        <p>
                                                            <i className="mdi mdi-checkbox-marked-outline text-primary me-2 h6"></i>
                                                            Ut enim ad minima
                                                        </p>
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="text-muted">
                                                        <p>
                                                            <i className="mdi mdi-checkbox-marked-outline text-primary me-2 h6"></i>
                                                            At vero eos accusamus et{' '}
                                                        </p>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="mt-4">
                                                <Link to="#" className="btn btn-custom">
                                                    Learn More <i className="mdi mdi-arrow-right ms-1"></i>
                                                </Link>
                                            </div>
                                        </Col>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="pills-customize-tab">
                                    <Row className="align-items-center justify-content-center">
                                        <Col lg={4} sm={6}>
                                            <img src={img2} alt="" className="img-fluid mx-auto d-block" />
                                        </Col>
                                        <Col lg={{ offset: 1, span: 6 }}>
                                            <div className="feature-icon mb-4">
                                                <h1>
                                                    <i className="pe-7s-edit text-primary"></i>
                                                </h1>
                                            </div>
                                            <h5 className="mb-3">Easy to customize</h5>
                                            <p className="text-muted">
                                                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                                                blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
                                                et
                                            </p>
                                            <p className="text-muted">
                                                If several languages coalesce the grammar of the resulting language{' '}
                                            </p>
                                            <Row className="pt-4">
                                                <Col lg={6}>
                                                    <div className="text-muted">
                                                        <p>
                                                            <i className="mdi mdi-checkbox-marked-outline text-primary me-2 h6"></i>
                                                            Nemo enim ipsam quia
                                                        </p>
                                                        <p>
                                                            <i className="mdi mdi-checkbox-marked-outline text-primary me-2 h6"></i>
                                                            Ut enim ad minima
                                                        </p>
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="text-muted">
                                                        <p>
                                                            <i className="mdi mdi-checkbox-marked-outline text-primary me-2 h6"></i>
                                                            At vero eos accusamus et{' '}
                                                        </p>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="mt-4">
                                                <Link to="#" className="btn btn-custom">
                                                    Learn More <i className="mdi mdi-arrow-right ms-1"></i>
                                                </Link>
                                            </div>
                                        </Col>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="pills-support-tab">
                                    <Row className="align-items-center justify-content-center">
                                        <Col lg={4} sm={6}>
                                            <img src={img3} alt="" className="img-fluid mx-auto d-block" />
                                        </Col>
                                        <Col lg={{ offset: 1, span: 6 }}>
                                            <div className="feature-icon mb-4">
                                                <i className="pe-7s-headphones h1 text-primary"></i>
                                            </div>
                                            <h5 className="mb-3">Awesome Support</h5>
                                            <p className="text-muted">
                                                It will be as simple as Occidental in fact, it will be Occidental. To an
                                                English person it will seem like simplified English as a skeptical
                                                Cambridge.
                                            </p>
                                            <p className="text-muted">
                                                If several languages coalesce the grammar of the resulting language{' '}
                                            </p>
                                            <Row className="pt-4">
                                                <Col lg={6}>
                                                    <div className="text-muted">
                                                        <p>
                                                            <i className="mdi mdi-checkbox-marked-outline text-primary me-2 h6"></i>
                                                            Nemo enim ipsam quia
                                                        </p>
                                                        <p>
                                                            <i className="mdi mdi-checkbox-marked-outline text-primary me-2 h6"></i>
                                                            Ut enim ad minima
                                                        </p>
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="text-muted">
                                                        <p>
                                                            <i className="mdi mdi-checkbox-marked-outline text-primary me-2 h6"></i>
                                                            At vero eos accusamus et{' '}
                                                        </p>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="mt-4">
                                                <Link to="#" className="btn btn-custom">
                                                    Learn More <i className="mdi mdi-arrow-right ms-1"></i>
                                                </Link>
                                            </div>
                                        </Col>
                                    </Row>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Feature;
