import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

// layouts
import DefaultLayout from '../layouts/Default';
import VerticalLayout from '../layouts/Vertical';
import HorizontalLayout from '../layouts/Horizontal';

// components
import PrivateRoute from './PrivateRoute';
import Root from './Root';
import RobotDetail from '../pages/Robo/index';

// constants
import { LayoutTypes } from '../constants';

// hooks
import { useRedux } from '../hooks';

// lazy load all the views
// auth
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const Confirm = React.lazy(() => import('../pages/auth/Confirm'));
const ForgetPassword = React.lazy(() => import('../pages/auth/ForgetPassword'));
const LockScreen = React.lazy(() => import('../pages/auth/LockScreen'));
const Logout = React.lazy(() => import('../pages/auth/Logout'));
const Fleets = React.lazy(() => import('../pages/Fleet'));
const SystemSettings = React.lazy(() => import('../pages/systemsettings'));

// dashboards
const DashBoard1 = React.lazy(() => import('../pages/dashboards/DashBoard1'));

const Piers = React.lazy(() => import('../pages/Piers'));
const Projects = React.lazy(() => import('../pages/Harbor'));

// lamding
const Landing = React.lazy(() => import('../pages/Landing'));

const loading = () => <div className=""></div>;

type LoadComponentProps = {
  component: React.LazyExoticComponent<() => JSX.Element>;
};

const LoadComponent = ({ component: Component }: LoadComponentProps) => (
  <Suspense fallback={loading()}>
    <Component />
  </Suspense>
);

const AllRoutes = () => {
  const { appSelector } = useRedux();

  const { layout } = appSelector((state) => ({
    layout: state.Layout,
  }));

  const getLayout = () => {
    let layoutCls: React.ComponentType = VerticalLayout;

    switch (layout.layoutType) {
      case LayoutTypes.LAYOUT_HORIZONTAL:
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  };
  let Layout = getLayout();

  return useRoutes([
    { path: '/', element: <Root /> },
    {
      // public routes
      path: '/',
      element: <DefaultLayout />,
      children: [
        {
          path: 'auth',
          children: [
            { path: 'login', element: <LoadComponent component={Login} /> },
            { path: 'register', element: <LoadComponent component={Register} /> },
            { path: 'confirm', element: <LoadComponent component={Confirm} /> },
            { path: 'forget-password', element: <LoadComponent component={ForgetPassword} /> },
            { path: 'lock-screen', element: <LoadComponent component={LockScreen} /> },
            { path: 'logout', element: <LoadComponent component={Logout} /> },
          ],
        }
      ],
    },
    {
      // auth protected routes
      path: '/',
      element: <PrivateRoute roles={'Admin'} component={Layout} />,
      children: [
        {
          path: 'harbor',
          children: [

            {
              path: 'robots/:id',
              element: <RobotDetail  />,
            },
            {
              path: '',
              element: <LoadComponent component={Projects} />,
            }
          ],
        },
        {
          path: "systemsettings",
            element: <LoadComponent component={SystemSettings} />,
        },
        {
          path: 'fleets',
          element: <LoadComponent component={Fleets} />,
        },
        {
          path: 'piers',
          element: <LoadComponent component={Piers} />,
        },
        {
          path: 'operations-center',
          element: <LoadComponent component={DashBoard1} />,
        },
      ],
    },
  ]);
};

export { AllRoutes };
