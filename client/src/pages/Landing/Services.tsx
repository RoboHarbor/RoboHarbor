import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// types
import { Service } from './types';

type ServicesProps = {
    services: Service[];
};

const Services = ({ services }: ServicesProps) => {
    return (
        <section className="section bg-light" id="services">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={6}>
                        <div className="title text-center">
                            <h6 className="text-primary small-title">Services</h6>
                            <h3>What we do</h3>
                            <p className="text-muted">At solmen va esser far uniform grammatica.</p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    {(services || []).map((servcie, index) => {
                        return (
                            <Col xl={4} sm={6} key={index}>
                                <div className="services-box p-4 bg-white mt-4">
                                    <div className="services-img float-start me-4">
                                        <img src={servcie.image} alt="" />
                                    </div>
                                    <h5>{servcie.title}</h5>
                                    <div className="overflow-hidden">
                                        <p className="text-muted">{servcie.shortDesc}</p>
                                        <Link to="#" className="text-custom">
                                            Read more...
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </section>
    );
};

export default Services;
