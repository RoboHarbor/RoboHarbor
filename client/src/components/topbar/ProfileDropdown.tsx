import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// hooks
import { useToggle } from '../../hooks';

// types
import { ProfileMenu } from '../../layouts/types';

type ProfileDropdownProps = {
    userImage: string;
    username: string;
    menuItems: ProfileMenu[];
};

const ProfileDropdown = ({ userImage, username, menuItems }: ProfileDropdownProps) => {
    const [isOpen, show, hide] = useToggle();

    /*
     * toggle apps-dropdown
     */
    const toggleDropdown = () => {
        isOpen ? hide() : show();
    };

    return (
        <Dropdown show={isOpen} onToggle={toggleDropdown}>
            <Dropdown.Toggle
                as="a"
                variant=""
                className="nav-link nav-user me-0 waves-effect waves-light"
                id="page-header-user-dropdown"
                onClick={toggleDropdown}
            >
                <img src={userImage} alt="user" className="rounded-circle" />
                <span className="pro-user-name ms-1">
                    {username} <i className="mdi mdi-chevron-down"></i>
                </span>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className="profile-dropdown">
                <div onClick={toggleDropdown}>
                    <Dropdown.Header className="noti-title">
                        <h6 className="text-overflow m-0">Welcome !</h6>
                    </Dropdown.Header>

                    {(menuItems || []).map((menu, i) => {
                        return (
                            <React.Fragment key={i + '-menu'}>
                                {i === menuItems.length - 1 && <Dropdown.Divider as="div" />}
                                <Link
                                    to={menu.redirectTo}
                                    className="dropdown-item notify-item"
                                    key={i + '-profile-menu'}
                                >
                                    <i className={classNames(menu.icon, 'me-1')}></i>
                                    <span>{menu.label}</span>
                                </Link>
                            </React.Fragment>
                        );
                    })}
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfileDropdown;
