export type MenuItemTypes = {
    key: string;
    label: string;
    isTitle?: boolean;
    icon?: string;
    url?: string;
    badge?: {
        variant: string;
        text: string;
    };
    parentKey?: string;
    target?: string;
    children?: MenuItemTypes[];
};

const MENU_ITEMS: MenuItemTypes[] = [
    { key: 'navigation', label: 'Navigation', isTitle: true },

    {
        key: 'harbor',
        label: 'Harbor',
        isTitle: false,
        icon: 'mdi mdi-ferry',
        url: '/harbor',
    },
    {
        key: 'fleets',
        label: 'Fleets',
        isTitle: false,
        icon: 'mdi mdi-group',
        badge: { variant: 'success', text: '9+' },
        url: '/fleets',
    },
    {
        key: 'piers',
        label: 'Piers',
        isTitle: false,
        icon: 'mdi mdi-pier',
        badge: { variant: 'success', text: '9+' },
        url: '/piers',
    },
    {
        key: 'dashboard',
        label: 'Operations Center',
        isTitle: false,
        icon: 'mdi mdi-chart-bar',
        badge: { variant: 'success', text: '9+' },
        url: '/operations-center',
    },
];

const HORIZONTAL_MENU_ITEMS: MenuItemTypes[] = [

    {
        key: 'harbor',
        label: 'Harbor',
        isTitle: false,
        url: '/harbor',
        parentKey: 'apps',
    },
    {
        key: 'dashboard',
        label: 'Dashboard',
        isTitle: false,
        icon: 'mdi mdi-view-dashboard',
        url: '/dashboard',
    },

];

export { MENU_ITEMS, HORIZONTAL_MENU_ITEMS };
