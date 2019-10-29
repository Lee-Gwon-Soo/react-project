import { FETCH_STUDY } from '../actions/types';

export default function (state = null, action) {
    switch(action.type){
        case FETCH_STUDY:
            return action.payload || false;
        default :
            return state;
    }
}