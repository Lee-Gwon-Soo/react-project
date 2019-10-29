import axios from 'axios';
import {AUTH_REQUEST} from './types';

export const signupRequest = (values, history) => async dispatch => {
    const res = await axios.post('/api/auth/signup', values);
   
    if(res.data.status){
        history.push('/login');
    } 
    dispatch({type:AUTH_REQUEST, payload:res.data.data });
    return res.data;
}

export const loginRequest = (values, history) => async dispatch => {
    const res = await axios.post('/api/auth/login', values);
    dispatch({type:AUTH_REQUEST, payload:res.data.data });
    
    return res.data;
}