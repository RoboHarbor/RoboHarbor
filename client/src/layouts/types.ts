export type Language = {
    name: string;
    flag: string;
};

export type AppItem = {
    name: string;
    icon: string;
    redirectTo: string;
};

export type Notification = {
    id: number;
    text: string;
    subText: string;
    icon?: string;
    avatar?: string;
    bgColor?: string;
};

export type ProfileMenu = {
    label: string;
    icon: string;
    redirectTo: string;
};

export type SearchOptions = {
    label: string;
    icon?: string;
    type: string;
    value?: string;
    userDetails?: {
        firstname: string;
        lastname: string;
        position: string;
        avatar: string;
    };
};
