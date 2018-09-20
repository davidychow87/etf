import * as types from '../../types';
import ajax from '../../../utils/ajax';
import querystring from 'querystring';

function getSuggestionsStart() {
    return { type: types.GET_SUGGESTIONS }
}

//returns array of suggestions
function fetchSuggestionsSuccess(suggestions) {
    return { type: types.GET_SUGGESTIONS_SUCCESS, suggestions }
}

function fetchSuggestionsFail(error) {
    return { type: types.GET_SUGGESTIONS_FAIL, error }
}

export function clearSuggestions() {
    return { type: types.CLEAR_SUGGESTIONS }
}

export function fetchSuggestions(value) {
    return(dispatch) => {
        dispatch(getSuggestionsStart());
        
        let qs = querystring.stringify({
           value, 
        });

        return ajax.get(`/stocks/suggestions?${qs}`, {})
        .then((suggestions) => {
          return dispatch(fetchSuggestionsSuccess(suggestions));
        })
        .catch(err => {
            console.log('Get Suggestions Error', err);
            dispatch(fetchSuggestionsFail(err));
        })
    }
}

//for dl the stucff
function downloadStart() {
    return { type: types.DOWNLOAD }
}

function downloadSuccess() {
    return { type: types.DOWNLOAD_SUCCESS }
}

function downloadFail() {
    return { type: types.DOWNLOAD_FAIL }
}


export function downloadStocks() {
    console.log('in here dl');
    return(dispatch) => {
        dispatch(downloadStart());
        
             return ajax.get('/stocks/database/post', {})
        .then(() => {
            console.log('done here');
          return dispatch(downloadSuccess());
        })
        .catch(err => {
            console.log('Downloads Error', err);
            dispatch(downloadFail(err));
        })
    }
}

