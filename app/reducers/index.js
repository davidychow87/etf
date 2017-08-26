import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import test from '../reducers/test';
import timeSeries from '../reducers/timeSeriesReducer';
import * as types from '../types';

const isFetching = (state = false, action) => {
  switch (action.type) {
    case types.CREATE_REQUEST:
      return true;
    case types.REQUEST_SUCCESS:
    case types.REQUEST_FAILURE:
      return false;
    default:
      return state;
  }
};

// Combine reducers with routeReducer which keeps track of
// router state
const rootReducer = combineReducers({
  // isFetching,
  // topic,
  // user,
  routing,
  test,
  timeSeries,
  // message,
  // routing,
});

export default rootReducer;
