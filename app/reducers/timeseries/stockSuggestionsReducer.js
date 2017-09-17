import { combineReducers } from 'redux';
import * as types from '../../types';
import db from '../../indexeddb/db';
import moment from 'moment';

const initialState = {
    suggestions: [],

}

export default function reducer(state = initialState, action = {}) {

    switch(action.type) {
        case types.GET_SUGGESTIONS:
            return {
                ...state,
            };

        case types.GET_SUGGESTIONS_SUCCESS:
            const tempSuggestions = [];
       
            action.suggestions.suggestions.forEach(suggestion => {
                let obj = {
                    value: suggestion.symbol,
                    suggestion: `${suggestion.symbol} - ${suggestion.name}`,
                }
                tempSuggestions.push(obj);
            });

            return {
                ...state,
                suggestions: tempSuggestions,
            };

        case types.GET_SUGGESTIONS_FAIL:
            console.log('Get Suggestions Fail', action.error);
            return {
                ...state,
                suggestions: [],
            }

        case types.CLEAR_SUGGESTIONS:
            return {
                ...state,
                suggestions: [],
            }

        default:
            return state;
    }

}