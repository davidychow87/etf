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

export function fetchSuggestions(value) {
    return(dispatch) => {
        dispatch(getSuggestionsStart());
        
        let qs = querystring.stringify({
           value, 
        });

        return ajax.get(`/stocks/suggestions?${qs}`, {})
        .then((suggestions) => {
          console.log("Suggestions", suggestions);
          return dispatch(fetchSuggestionsSuccess(suggestions));
        })
        .catch(err => {
            console.log('Get Suggestions Error', err);
            dispatch(fetchSuggestionsFail(err));
        })
    }
}