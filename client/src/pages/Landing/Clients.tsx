import { Col, Container, Row } from 'react-bootstrap';

// types
import { Testimonial } from './types';

// images
import img1 from '../../assets/images/landing/clients/1.png';
import img2 from '../../assets/images/landing/clients/2.png';
import img3 from '../../assets/images/landing/clients/3.png';
import img4 from '../../assets/images/landing/clients/4.png';

type ClientsProps = {
    testimonials: Testimonial[];
};

const Clients = ({ testimonials }: ClientsProps) => {
    return (
        <section className="section bg-light" id="clients">
            <Container fluid>
                <Row className="justify-content-center">
                    <Col lg={6}>
                        <div className="title text-center mb-5">
                            <h6 className="text-primary small-title">Clients</h6>
                            <h3>What our Users Says</h3>
                            <p className="text-muted">At solmen va esser far uniform grammatica.</p>
                        </div>
                    </Col>
                </Row>

                <Row>
                    {(testimonials || []).map((item, index) => {
                        return (
                            <Col lg={4} key={index.toString()}>
                                <div className="testi-box p-4 bg-white mt-4 text-center">
                                    <p className="text-muted mb-4">"{item.message}"</p>
                                    <div className="testi-img mb-4">
                                        <img src={item.avatar} alt="" className="rounded-circle img-thumbnail" />
                                    </div>
                                    <p className="text-muted mb-1"> - {item.title}</p>
                                    <h5 className="font-18">{item.clientName}</h5>

                                    <div className="testi-icon">
                                        <i className="mdi mdi-format-quote-open display-2"></i>
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>

                <Row className="mt-5 pt-5">
                    {[img1, img2, img3, img4].map((src, index) => {
                        return (
                            <Col lg={3} sm={6} key={index.toString()}>
                                <div className="client-images">
                                    <img src={src} alt="logo-img" className="mx-auto img-fluid d-block" />
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </section>
    );
};

export default Clients;
