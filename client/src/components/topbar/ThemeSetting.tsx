import { Link } from 'react-router-dom';

type ThemeSettingProps = {
    handleRightSideBar: () => void;
};

const ThemeSetting = ({ handleRightSideBar }: ThemeSettingProps) => {
    return (
        <>
            <Link to="#" className="nav-link right-bar-toggle waves-effect waves-light" onClick={handleRightSideBar}>
                <i className="fe-settings noti-icon"></i>
            </Link>
        </>
    );
};

export default ThemeSetting;
