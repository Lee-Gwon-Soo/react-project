import { FETCH_USER, AUTH_REQUEST } from '../actions/types';

export default function (state = null, action) {
    switch(action.type){
        case FETCH_USER:
            return action.payload || false;
        case AUTH_REQUEST:
            return action.payload || false;
        default :
            return state;
    }
}