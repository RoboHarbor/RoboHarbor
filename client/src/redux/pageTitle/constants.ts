enum PageTitleAction {
    CHANGE_PAGETITLE = '@@pagetitle/CHANGE_LAYOUT',
}

export type PageTitleState = {
    pageTitle: {
        title: string;
        breadCrumbItems: {
            label: string;
            path: string;
            active?: boolean;
        }[];
    };
};

export { PageTitleAction };
