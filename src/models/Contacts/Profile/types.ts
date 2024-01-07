export type TeamMember = {
    avatar: string;
    name: string;
    designation: string;
};

export type Reminder = {
    variant: string;
    title: string;
    date: string;
    time: string;
};

export type Comment = {
    avatar: string;
    name: string;
    time: string;
    content: {
        message?: string;
        media?: string[];
    };
    replies?: Comment[];
};

export type Post = {
    avatar: string;
    name: string;
    time: string;
    content: {
        message?: string;
        media?: string[];
    };
    comments?: Comment[];
};
