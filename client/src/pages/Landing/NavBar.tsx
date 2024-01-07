import { useEffect } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// store
import { RootState } from '../../redux/store';

// images
import logo from '../../assets/images/logo-light.png';
import logo1 from '../../assets/images/logo-dark.png';

const NavBar = () => {
    const { user, userLoggedIn } = useSelector((state: RootState) => ({
        user: state.Auth.user,
        loading: state.Auth.loading,
        error: state.Auth.error,
        userLoggedIn: state.Auth.userLoggedIn,
    }));

    // on scroll add navbar class
    useEffect(() => {
        if (document.body) document.body.classList.add('pb-0');

        window.addEventListener('scroll', (e) => {
            e.preventDefault();
            const navbar = document.getElementById('nav-sticky');
            if (navbar) {
                if (document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50) {
                    navbar.classList.add('nav-sticky');
                } else {
                    navbar.classList.remove('nav-sticky');
                }
            }
        });
        return () => {
            if (document.body) document.body.classList.remove('pb-0');
        };
    }, []);

    return (
        <Navbar expand={false} className="navbar-expand-lg fixed-top landing-nav sticky sticky-dark" id="nav-sticky">
            <Container>
                <Link to="/" className="logo text-uppercase">
                    <img src={logo} alt="" className="logo-light" height="21" />
                    <img src={logo1} alt="" className="logo-dark" height="21" />
                </Link>
                <Navbar.Toggle>
                    <i className="mdi mdi-menu"></i>
                </Navbar.Toggle>
                <Navbar.Collapse id="navbarCollapse">
                    <Nav as="ul" className="navbar-nav ms-auto">
                        <Nav.Item as="li">
                            <Nav.Link href="#home">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link href="#features">Features</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link href="#services">Services</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link href="#demo">Demos</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link href="#clients">Clients</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link href="#contact">Contact</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    {userLoggedIn || user ? (
                        <Button href="/auth/logout" variant="outline-info" className="navbar-btn btn-sm px-3 ms-1">
                            Logout
                        </Button>
                    ) : (
                        <Button href="/auth/login" variant="outline-info" className="navbar-btn btn-sm px-3 ms-1">
                            Login
                        </Button>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
