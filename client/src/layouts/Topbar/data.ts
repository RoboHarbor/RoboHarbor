import { Notification, ProfileMenu, SearchOptions } from '../types';

// images
import avatar1 from '../../assets/images/users/user-1.jpg';
import avatar2 from '../../assets/images/users/user-2.jpg';
import avatar4 from '../../assets/images/users/user-4.jpg';
import avatar5 from '../../assets/images/users/user-5.jpg';

// get the notifications
const notifications: Notification[] = [
    {
        id: 1,
        text: 'Cristina Pride',
        subText: 'Hi, How are you? What about our next meeting',
        avatar: avatar1,
    },
    {
        id: 2,
        text: 'Caleb Flakelar commented on Admin',
        subText: '1 min ago',
        icon: 'mdi mdi-comment-account-outline',
        bgColor: 'primary',
    },
    {
        id: 3,
        text: 'Karen Robinson',
        subText: 'Wow ! this admin looks good and awesome design',
        avatar: avatar4,
    },
    {
        id: 4,
        text: 'New user registered.',
        subText: '5 hours ago',
        icon: 'mdi mdi-account-plus',
        bgColor: 'warning',
    },
    {
        id: 5,
        text: 'Caleb Flakelar commented on Admin',
        subText: '1 min ago',
        icon: 'mdi mdi-comment-account-outline',
        bgColor: 'info',
    },
    {
        id: 6,
        text: 'Carlos Crouch liked Admin',
        subText: '13 days ago',
        icon: 'mdi mdi-heart',
        bgColor: 'secondary',
    },
];

// get the profilemenu
const profileMenus: ProfileMenu[] = [
    {
        label: 'My Account',
        icon: 'fe-user',
        redirectTo: '/apps/contacts/profile',
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

const searchOptions: SearchOptions[] = [
    { value: '1', label: 'Analytics Report', icon: 'fe-home', type: 'report' },
    {
        value: '2',
        label: 'How can I help you?',
        icon: 'fe-aperture',
        type: 'help',
    },
    {
        value: '3',
        label: 'User profile settings',
        icon: 'fe-settings',
        type: 'settings',
    },
    {
        label: 'Erwin E. Brown',
        value: 'users1',
        type: 'users',
        userDetails: {
            firstname: 'Erwin',
            lastname: 'E. Brown',
            position: 'UI Designer',
            avatar: avatar2,
        },
    },
    {
        label: 'Jacob Deo',
        value: 'users2',
        type: 'users',
        userDetails: {
            firstname: 'Jacob',
            lastname: 'Deo',
            position: 'Developer',
            avatar: avatar5,
        },
    },
];

export { notifications, profileMenus, searchOptions };
