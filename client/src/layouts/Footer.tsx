import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <Container fluid>
                <Row>
                    <Col md={6}>
                        {new Date().getFullYear()} &copy; RoboHarbor
                    </Col>
                    <Col md={6}>
                        <div className="text-md-end footer-links d-none d-md-block">
                            <Link to="#">Help</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
