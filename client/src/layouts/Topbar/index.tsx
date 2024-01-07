import { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// actions
import { showRightSidebar } from '../../redux/actions';

// constants
import { LayoutTypes } from '../../constants';

// hooks
import { useRedux } from '../../hooks';

// components
import SearchDropdown from '../../components/topbar/SearchDropdown';
import ThemeSetting from '../../components/topbar/ThemeSetting';
import TopbarSearch from '../../components/topbar/TopbarSearch';
import NotificationDropdown from '../../components/topbar/NotificationDropdown';
import ProfileDropdown from '../../components/topbar/ProfileDropdown';

// dummy data
import { notifications, profileMenus, searchOptions } from './data';

// images
import logoSm from '../../assets/images/logo-sm.png';
import avatar1 from '../../assets/images/users/user-1.jpg';
import logoDark from '../../assets/images/logo-dark.png';
import logoLight from '../../assets/images/logo-light.png';

type TopbarProps = {
    openLeftMenuCallBack: () => void;
    containerClass?: string;
};

const Topbar = ({ openLeftMenuCallBack, containerClass }: TopbarProps) => {
    const { dispatch, appSelector } = useRedux();
    const [isopen, setIsopen] = useState<boolean>(false);

    const { layout, pageTitle } = appSelector((state) => ({
        layout: state.Layout.layoutType,
        pageTitle: state.PageTitle.pageTitle,
    }));

    /**
     * Toggle the leftmenu when having mobile screen
     */
    const handleLeftMenuCallBack = () => {
        setIsopen(!isopen);
        if (openLeftMenuCallBack) openLeftMenuCallBack();
    };

    /**
     * Toggles the right sidebar
     */
    const handleRightSideBar = () => {
        dispatch(showRightSidebar());
    };

    return (
        <div className="navbar-custom">
            <div className={containerClass}>
                <ul className="list-unstyled topnav-menu float-end mb-0">
                    <li className="d-none d-lg-block">
                        <TopbarSearch options={searchOptions} />
                    </li>

                    <li className="dropdown d-inline-block d-lg-none">
                        <SearchDropdown />
                    </li>
                    <li className="dropdown notification-list topbar-dropdown">
                        <NotificationDropdown notifications={notifications} />
                    </li>
                    <li className="dropdown notification-list topbar-dropdown">
                        {/* User */}
                        <ProfileDropdown userImage={avatar1} username={'Nowak'} menuItems={profileMenus} />
                    </li>
                    <li className="dropdown notification-list">
                        <ThemeSetting handleRightSideBar={handleRightSideBar} />
                    </li>
                </ul>

                {/* LOGO  */}
                <div className="logo-box">
                    <Link to="/" className="logo logo-dark text-center">
                        <span className="logo-sm">
                            <img src={logoSm} alt="logo-sm" height="22" />
                        </span>
                        <span className="logo-lg">
                            <img src={logoDark} alt="logo-dark" height="16" />
                        </span>
                    </Link>

                    <Link to="/" className="logo logo-light text-center">
                        <span className="logo-sm">
                            <img src={logoSm} alt="logo-sm" height="22" />
                        </span>
                        <span className="logo-lg">
                            <img src={logoLight} alt="logo-light" height="16" />
                        </span>
                    </Link>
                </div>

                <ul className="list-unstyled topnav-menu topnav-menu-left mb-0">
                    {layout === LayoutTypes.LAYOUT_VERTICAL ? (
                        <>
                            {/* Mobile menu toggle (Vertical Layout) */}
                            <li onClick={handleLeftMenuCallBack}>
                                <button className="button-menu-mobile disable-btn waves-effect">
                                    <i className="fe-menu"></i>
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* Mobile menu toggle (Horizontal Layout) */}
                            <li>
                                <Link
                                    to="#"
                                    className={classNames('navbar-toggle nav-link', {
                                        open: isopen,
                                    })}
                                    onClick={handleLeftMenuCallBack}
                                >
                                    <div className="lines">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </Link>
                            </li>
                        </>
                    )}

                    {layout === LayoutTypes.LAYOUT_VERTICAL && (
                        <li>
                            <h4 className="page-title-main">{pageTitle.title}</h4>
                        </li>
                    )}
                </ul>

                <div className="clearfix"></div>
            </div>
        </div>
    );
};

export default Topbar;
