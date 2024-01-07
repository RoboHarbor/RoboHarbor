import { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// helpers
import { getMenuItems } from '../helpers/menu';

// components
import Scrollbar from '../components/Scrollbar';

import AppMenu from './Menu';

// images
import profileImg from '../assets/images/users/user-1.jpg';

/* user box */
const UserBox = () => {
    // get the profilemenu
    const ProfileMenus = [
        {
            label: 'My Account',
            icon: 'fe-user',
            redirectTo: '/apps/contacts/profile',
        },
        {
            label: 'Settings',
            icon: 'fe-settings',
            redirectTo: '#',
        },
        {
            label: 'Lock Screen',
            icon: 'fe-lock',
            redirectTo: '/auth/lock-screen',
        },
        {
            label: 'Logout',
            icon: 'fe-log-out',
            redirectTo: '/auth/logout',
        },
    ];

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    /*
     * toggle dropdown
     */
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="user-box text-center">

        </div>
    );
};

/* sidebar content */
const SideBarContent = () => {
    return (
        <>
            <UserBox />

            <div id="sidebar-menu">
                <AppMenu menuItems={getMenuItems()} />
            </div>

            <div className="clearfix" />
        </>
    );
};

type LeftSidebarProps = {
    isCondensed: boolean;
};

const LeftSidebar = ({ isCondensed }: LeftSidebarProps) => {
    const menuNodeRef: any = useRef(null);

    /**
     * Handle the click anywhere in doc
     */
    const handleOtherClick = (e: any) => {
        if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target)) return;
        // else hide the menubar
        if (document.body) {
            document.body.classList.remove('sidebar-enable');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOtherClick, false);

        return () => {
            document.removeEventListener('mousedown', handleOtherClick, false);
        };
    }, []);

    return (
        <div className="left-side-menu" ref={menuNodeRef}>
            {!isCondensed && (
                <Scrollbar style={{ maxHeight: '100%' }}>
                    <SideBarContent />
                </Scrollbar>
            )}
            {isCondensed && <SideBarContent />}
        </div>
    );
};

LeftSidebar.defaultProps = {
    isCondensed: false,
};

export default LeftSidebar;
