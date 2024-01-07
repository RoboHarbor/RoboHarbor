import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// images
import logoLight from '../../assets/images/logo-light.png';

const Footer = () => {
    return (
        <footer className="landing-footer bg-dark">
            <Container fluid>
                <Row>
                    <Col xl={12}>
                        <div className="text-center">
                            <div className="footer-logo mb-3">
                                <img src={logoLight} alt="" height="20" />
                            </div>
                            <ul className="list-inline footer-list text-center mt-5">
                                <li className="list-inline-item">
                                    <Link to="#">Home</Link>
                                </li>
                                <li className="list-inline-item">
                                    <Link to="#">About</Link>
                                </li>
                                <li className="list-inline-item">
                                    <Link to="#">Services</Link>
                                </li>
                                <li className="list-inline-item">
                                    <Link to="#">Clients</Link>
                                </li>
                                <li className="list-inline-item">
                                    <Link to="#">Pricing</Link>
                                </li>
                                <li className="list-inline-item">
                                    <Link to="#">Contact</Link>
                                </li>
                            </ul>
                            <ul className="list-inline social-links mb-4 mt-5">
                                <li className="list-inline-item">
                                    <Link to="#">
                                        <i className="mdi mdi-facebook"></i>
                                    </Link>
                                </li>
                                <li className="list-inline-item">
                                    <Link to="#">
                                        <i className="mdi mdi-twitter"></i>
                                    </Link>
                                </li>
                                <li className="list-inline-item">
                                    <Link to="#">
                                        <i className="mdi mdi-instagram"></i>
                                    </Link>
                                </li>
                                <li className="list-inline-item">
                                    <Link to="#">
                                        <i className="mdi mdi-google-plus"></i>
                                    </Link>
                                </li>
                            </ul>
                            <p className="text-white-50 mb-4">
                                {new Date().getFullYear()} © Adminto. Design by{' '}
                                <Link to="#" className="text-white-50">
                                    Coderthemes
                                </Link>{' '}
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
