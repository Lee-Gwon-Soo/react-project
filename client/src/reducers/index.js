import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducers from './authReducers';
import studyReducers from './studyReducers';

export default combineReducers({
    auth: authReducers,
    study: studyReducers,
    form: reduxForm,
});
