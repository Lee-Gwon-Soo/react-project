import {FETCH_STUDY} from './types';
import axios from 'axios';

export const setStudyId = (studyId) => async dispatch => {
    const res = await axios.post('/api/study/setStudyId', {studyId:studyId});
    dispatch({type:FETCH_STUDY, payload:res.data });
}