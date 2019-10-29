import axios from 'axios';
import {FETCH_USER ,FETCH_STUDY} from './types';

export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user');
    dispatch({type:FETCH_USER, payload:res.data });
};


export const fetchStudy = () => async dispatch => {
    const res = await axios.get('/api/getcurrent_study');
    dispatch({type:FETCH_STUDY, payload:res.data });
};
