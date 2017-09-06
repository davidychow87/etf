import { combineReducers } from 'redux';
import * as types from '../../types';
import db from '../../indexeddb/db';
import moment from 'moment';

const initialState = {
    suggestions: ['test'],

}

export default function reducer(state = initialState, action = {}) {
    switch(action.type) {
        case types.GET_SUGGESTIONS:
            return {
                ...state,
            };

        case types.GET_SUGGESTIONS_SUCCESS:
            console.log('GET SUGGESTIONS SUCCESS', action.suggestions)
            return {
                ...state,
                suggestions: action.suggestions,
            };

        case types.GET_SUGGESTIONS_FAIL:
            console.log('Get Suggestions Fail', action.error);
            return {
                ...state,
                suggestions: [],
            }

        default:
            return state;
    }

}