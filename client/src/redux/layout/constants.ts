// constants
import {
    LayoutTypes,
    LayoutColor,
    LayoutWidth,
    MenuPositions,
    SideBarTheme,
    SideBarTypes,
    TopbarTheme,
} from '../../constants/layout';

enum LayoutActionTypes {
    CHANGE_LAYOUT = '@@layout/CHANGE_LAYOUT',
    CHANGE_LAYOUT_COLOR = '@@layout/CHANGE_LAYOUT_COLOR',
    CHANGE_LAYOUT_WIDTH = '@@layout/CHANGE_LAYOUT_WIDTH',
    CHANGE_MENU_POSITIONS = '@@layout/CHANGE_MENU_POSITIONS',
    CHANGE_SIDEBAR_THEME = '@@layout/CHANGE_SIDEBAR_THEME',
    CHANGE_SIDEBAR_TYPE = '@@layout/CHANGE_SIDEBAR_TYPE',
    TOGGLE_SIDEBAR_USER_INFO = '@@layout/TOGGLE_SIDEBAR_USER_INFO',
    CHANGE_TOPBAR_THEME = '@@layout/CHANGE_TOPBAR_THEME',

    TOGGLE_TWO_TONE_ICONS = '@@layout/TOGGLE_TWO_TONE_ICONS',
    SHOW_RIGHT_SIDEBAR = '@@layout/SHOW_RIGHT_SIDEBAR',
    HIDE_RIGHT_SIDEBAR = '@@layout/HIDE_RIGHT_SIDEBAR',
}

export type LayoutStateTypes = {
    layoutColor: LayoutColor.LAYOUT_COLOR_LIGHT | LayoutColor.LAYOUT_COLOR_DARK;
    layoutType: LayoutTypes.LAYOUT_VERTICAL | LayoutTypes.LAYOUT_HORIZONTAL;
    layoutWidth: LayoutWidth.LAYOUT_WIDTH_FLUID | LayoutWidth.LAYOUT_WIDTH_BOXED;
    menuPosition: MenuPositions.MENU_POSITION_FIXED | MenuPositions.MENU_POSITION_SCROLLABLE;
    leftSideBarTheme:
        | SideBarTheme.LEFT_SIDEBAR_THEME_LIGHT
        | SideBarTheme.LEFT_SIDEBAR_THEME_DARK
        | SideBarTheme.LEFT_SIDEBAR_THEME_BRAND
        | SideBarTheme.LEFT_SIDEBAR_THEME_GRADIENT;
    leftSideBarType:
        | SideBarTypes.LEFT_SIDEBAR_TYPE_DEFAULT
        | SideBarTypes.LEFT_SIDEBAR_TYPE_CONDENSED
        | SideBarTypes.LEFT_SIDEBAR_TYPE_COMPACT;
    showSidebarUserInfo: boolean;
    topbarTheme: TopbarTheme.TOPBAR_THEME_LIGHT | TopbarTheme.TOPBAR_THEME_DARK;
    isOpenRightSideBar: boolean;
};

export { LayoutActionTypes };
