// constants
import { PageTitleAction } from './constants';

export const changePageTitle = (pageTitle: {
    title: string;
    breadCrumbItems: {
        label: string;
        path: string;
        active?: boolean;
    }[];
}) => ({
    type: PageTitleAction.CHANGE_PAGETITLE,
    payload: pageTitle,
});
