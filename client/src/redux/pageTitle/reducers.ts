// constants
import { PageTitleAction, PageTitleState } from './constants';

const INIT_STATE = {
    pageTitle: {
        title: '',
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
