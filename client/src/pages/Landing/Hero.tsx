import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// images
import img from '../../assets/images/landing/home-img.png';

const Hero = () => {
    return (
        <section className="bg-home bg-gradient" id="home">
            <div className="home-center">
                <div className="home-desc-center">
                    <Container>
                        <Row className="align-items-center">
                            <Col lg={6} sm={6}>
                                <div className="home-title">
                                    <h5 className="mb-3 text-white-50">Discover Adminto Today</h5>
                                    <h2 className="mb-4 text-white">Make your Site Amazing & Unique with Adminto</h2>
                                    <p className="text-white-50 home-desc font-16 mb-5">
                                        Adminto is a fully featured premium Landing template built on top of awesome
                                        Bootstrap 5.1.3, modern web technology HTML5, CSS3 and ReactJS.
                                    </p>
                                    <div className="watch-video mt-5">
                                        <Link to="#" className="btn btn-custom me-4">
                                            Get Started
                                            <i className="mdi mdi-chevron-right ms-1"></i>
                                        </Link>
                                        <a href="http://vimeo.com/99025203" className="video-play-icon text-white">
                                            <i className="mdi mdi-play play-icon-circle me-2"></i>
                                            <span>Watch The Video</span>
                                        </a>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={{ offset: 1, span: 5 }} sm={6}>
                                <div className="home-img mo-mt-20">
                                    <img src={img} alt="" className="img-fluid mx-auto d-block" />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </section>
    );
};

export default Hero;
