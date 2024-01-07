import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import PageTitle from './pageTitle/reducers';

export default combineReducers({
    Auth,
    Layout,
    PageTitle,
});
