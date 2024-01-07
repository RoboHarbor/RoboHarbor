// app constants
import {
    LayoutTypes,
    LayoutColor,
    LayoutWidth,
    MenuPositions,
    SideBarTheme,
    SideBarTypes,
    TopbarTheme,
} from '../../constants/layout';

// utils
import { getLayoutConfigs } from '../../utils';

// actions
import { LayoutActionType } from './actions';

// action constants
import { LayoutActionTypes, LayoutStateTypes } from './constants';

const INIT_STATE = {
    layoutColor: LayoutColor.LAYOUT_COLOR_LIGHT,
    layoutType: LayoutTypes.LAYOUT_VERTICAL,
    layoutWidth: LayoutWidth.LAYOUT_WIDTH_FLUID,
    menuPosition: MenuPositions.MENU_POSITION_SCROLLABLE,
    leftSideBarTheme: SideBarTheme.LEFT_SIDEBAR_THEME_LIGHT,
    leftSideBarType: SideBarTypes.LEFT_SIDEBAR_TYPE_COMPACT,
    showSidebarUserInfo: false,
    topbarTheme: TopbarTheme.TOPBAR_THEME_LIGHT,
    isOpenRightSideBar: false,
};

const Layout = (state: LayoutStateTypes = INIT_STATE, action: LayoutActionType<string | boolean | null>) => {
    switch (action.type) {
        case LayoutActionTypes.CHANGE_LAYOUT:
            return {
                ...state,
                layoutType: action.payload,
            };
        case LayoutActionTypes.CHANGE_LAYOUT_COLOR:
            return {
                ...state,
                layoutColor: action.payload,
                ...getLayoutConfigs(action.type, action.payload!),
            };
        case LayoutActionTypes.CHANGE_LAYOUT_WIDTH:
            return {
                ...state,
                layoutWidth: action.payload,
                ...getLayoutConfigs(action.type, action.payload!),
            };
        case LayoutActionTypes.CHANGE_MENU_POSITIONS:
            return {
                ...state,
                menuPosition: action.payload,
            };
        case LayoutActionTypes.CHANGE_SIDEBAR_THEME:
            return {
                ...state,
                leftSideBarTheme: action.payload,
            };
        case LayoutActionTypes.CHANGE_SIDEBAR_TYPE:
            return {
                ...state,
                leftSideBarType: action.payload,
            };
        case LayoutActionTypes.TOGGLE_SIDEBAR_USER_INFO:
            return {
                ...state,
                showSidebarUserInfo: action.payload,
            };
        case LayoutActionTypes.CHANGE_TOPBAR_THEME:
            return {
                ...state,
                topbarTheme: action.payload,
            };
        case LayoutActionTypes.SHOW_RIGHT_SIDEBAR:
            return {
                ...state,
                isOpenRightSideBar: true,
            };
        case LayoutActionTypes.HIDE_RIGHT_SIDEBAR:
            return {
                ...state,
                isOpenRightSideBar: false,
            };
        default:
            return state;
    }
};

export default Layout;
