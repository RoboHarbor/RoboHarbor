// constants
import { PageTitleAction, PageTitleState } from './constants';

const INIT_STATE = {
    pageTitle: {
        title: '',
        actions: [],
        breadCrumbItems: [
            {
                label: '',
                path: '',
            },
        ],
    },
};

const PageTitle = (
    state: PageTitleState = INIT_STATE,
    action: {
        type: PageTitleAction;
        payload: {
            title: string;
            actions: any[];
            breadCrumbItems: {
                label: string;
                path: string;
                active?: boolean;
            }[];
        };
    }
) => {
    switch (action.type) {
        case PageTitleAction.CHANGE_PAGETITLE:
            return {
                ...state,
                pageTitle: action.payload,
            };
        default:
            return { ...state };
    }
};

export default PageTitle;
