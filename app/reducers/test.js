import { combineReducers } from 'redux';
import * as types from '../types';

const initialState = {
  isTesting: false,
  testResult: '',
}

export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
    case types.TEST_CALL:
    console.log("testing the call")
      return {
        ...state,
        isTesting: true,
      };

    case types.TEST_CALL_SUCCESS:
    console.log("Success! test", action.testResponse);
      return {
        ...state,
        isTesting: false,
        testResult: action.testResponse,
      };

    case types.TEST_CALL_FAIL:
      return {
        ...state,
        isTesting: false
      };

    default:
      return state;
  }
}

// const testReducer = combineReducers({
//   reducer
// });
// export default testReducer;
