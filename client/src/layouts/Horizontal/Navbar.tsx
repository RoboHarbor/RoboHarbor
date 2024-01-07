import React from 'react';
import { Collapse } from 'react-bootstrap';
import classNames from 'classnames';

// helpers
import { getHorizontalMenuItems } from '../../helpers/menu';

// components
import AppMenu from './Menu';

type NavbarProps = {
    isMenuOpened?: boolean;
};

const Navbar = ({ isMenuOpened }: NavbarProps) => {
    return (
        <div className="topnav">
            <div className="container-fluid">
                <nav className={classNames('navbar', 'navbar-expand-lg', 'topnav-menu', 'navbar-light')}>
                    <Collapse in={isMenuOpened} className="navbar-collapse">
                        <div id="topnav-menu-content">
                            <AppMenu menuItems={getHorizontalMenuItems()} />
                        </div>
                    </Collapse>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;
