// app constants
import { LayoutColor, TopbarTheme, LayoutWidth, SideBarTypes } from '../constants';
import { LayoutActionTypes } from '../redux/layout/constants';

// actions
import { LayoutActionType } from '../redux/actions';

type ConfigTypes = {
    topbarTheme: TopbarTheme.TOPBAR_THEME_LIGHT | TopbarTheme.TOPBAR_THEME_DARK;
    leftSideBarType:
        | SideBarTypes.LEFT_SIDEBAR_TYPE_DEFAULT
        | SideBarTypes.LEFT_SIDEBAR_TYPE_CONDENSED
        | SideBarTypes.LEFT_SIDEBAR_TYPE_COMPACT;
};

// add property to change in particular option
let config: ConfigTypes = {
    topbarTheme: TopbarTheme.TOPBAR_THEME_LIGHT,
    leftSideBarType: SideBarTypes.LEFT_SIDEBAR_TYPE_DEFAULT,
};

const getLayoutConfigs = (
    actionType: LayoutActionType<string | boolean | null>['type'],
    value: string | boolean | null
) => {
    switch (actionType) {
        case LayoutActionTypes.CHANGE_LAYOUT_COLOR:
            switch (value) {
                case LayoutColor.LAYOUT_COLOR_DARK:
                    config.topbarTheme = TopbarTheme.TOPBAR_THEME_DARK;
                    break;
                case LayoutColor.LAYOUT_COLOR_LIGHT:
                    config.topbarTheme = TopbarTheme.TOPBAR_THEME_LIGHT;
                    break;
                default:
                    return config;
            }
            break;

        case LayoutActionTypes.CHANGE_LAYOUT_WIDTH:
            switch (value) {
                case LayoutWidth.LAYOUT_WIDTH_FLUID:
                    config.leftSideBarType = SideBarTypes.LEFT_SIDEBAR_TYPE_DEFAULT;
                    break;
                case LayoutWidth.LAYOUT_WIDTH_BOXED:
                    config.leftSideBarType = SideBarTypes.LEFT_SIDEBAR_TYPE_CONDENSED;
                    break;
                default:
                    return config;
            }
            break;
        default:
            return config;
    }
    return config;
};

/**
 * Changes the body attribute
 */
const changeBodyAttribute = (attribute: string, value: string): void => {
    if (document.body) document.body.setAttribute(attribute, value);
};

export { getLayoutConfigs, changeBodyAttribute };
