export type Layout = {
    name: string;
    image: string;
    link: string;
};

export type Testimonial = {
    id: number;
    clientName: string;
    title: string;
    avatar: string;
    message: string;
};

export type Statistic = {
    icon: string;
    title: string;
    value: number;
    counterOptions?: Record<string, any>;
};

export type PricingPlan = {
    id: number;
    name: string;
    price: number;
    duration: string;
    features: Array<string>;
};

export type Service = {
    image: string;
    title: string;
    shortDesc: string;
};
