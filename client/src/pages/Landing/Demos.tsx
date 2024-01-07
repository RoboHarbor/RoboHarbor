import { Button, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// types
import { Layout } from './types';

type DemosProps = {
    layouts: Layout[];
};

const Demos = ({ layouts }: DemosProps) => {
    return (
        <section className="section" id="demo">
            <Container fluid>
                <Row className="justify-content-center">
                    <Col lg={6}>
                        <div className="title text-center mb-5">
                            <h6 className="text-primary small-title">Demos</h6>
                            <h3>Available Demos</h3>
                            <p className="text-muted">At solmen va esser far uniform grammatica.</p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    {(layouts || []).map((layout, index) => {
                        return (
                            <Col key={index.toString()} lg={4} sm={6}>
                                <div className="demo-box text-center p-3 mt-4">
                                    <Link to="#" className="text-dark">
                                        <div className="position-relative demo-content">
                                            <div className="demo-img">
                                                <img
                                                    src={layout.image}
                                                    alt=""
                                                    className="img-fluid mx-auto d-block rounded"
                                                />
                                            </div>
                                            <div className="demo-overlay">
                                                <div className="overlay-icon">
                                                    <i className="pe-7s-expand1 h1 text-white"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <h5 className="font-18">{layout.name}</h5>
                                        </div>
                                    </Link>
                                </div>
                            </Col>
                        );
                    })}
                </Row>

                <Row>
                    <Col xs={12}>
                        <div className="text-center mt-4">
                            <Button className="btn btn-custom">
                                More Demos <i className="mdi mdi-chevron-right"></i>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Demos;
