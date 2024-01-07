import { useEffect, useState } from 'react';

// actions
import { changePageTitle } from '../redux/actions';

// hooks
import { useRedux } from './index';

export default function usePageTitle(value: {
    title: string;
    breadCrumbItems: {
        label: string;
        path: string;
        active?: boolean;
    }[];
}) {
    const { dispatch } = useRedux();

    const [pageTitle] = useState(value);

    useEffect(() => {
        // set page title
        dispatch(changePageTitle(pageTitle));
    }, [dispatch, pageTitle]);
}
