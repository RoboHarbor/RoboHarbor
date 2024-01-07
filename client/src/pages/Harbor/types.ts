export type ProjectsList = {
    id: number;
    title: string;
    category: string;
    state: string;
    shortDesc: string;
    question: number;
    comment: number;
    teamMembers: {
        image: string;
        name: string;
    }[];
    progress: number;
    variant: string;
};
