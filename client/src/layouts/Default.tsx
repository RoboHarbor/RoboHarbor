import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// hooks
import { useRedux } from '../hooks';

// utils
import { changeBodyAttribute } from '../utils';

const loading = () => <div className=""></div>;

type DefaultLayoutProps = {};

const DefaultLayout = (props: DefaultLayoutProps) => {
    const { appSelector } = useRedux();

    const { layoutColor } = appSelector((state) => ({
        layoutColor: state.Layout.layoutColor,
    }));

    useEffect(() => {
        changeBodyAttribute('data-layout-color', layoutColor);
    }, [layoutColor]);

    return (
        <Suspense fallback={loading()}>
            <Outlet />
        </Suspense>
    );
};
export default DefaultLayout;
