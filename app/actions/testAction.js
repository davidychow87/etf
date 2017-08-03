import * as types from '../types';
import ajax from '../../utils/ajax';
function beginTestCall(call) {
  return { type: types.TEST_CALL };
}


function testCallSuccess(response) {
  return { type: types.TEST_CALL_SUCCESS, testResponse: response };
}

export function testCall(call) {
  return (dispatch) => {
    dispatch(beginTestCall(call));

    return ajax.get('/test-route', {})
      .then((result) => {
        console.log("Complete", result);
        return dispatch(testCallSuccess(result));
      })

    // return authService().login(data)
    //   .then((response) => {
    //       dispatch(loginSuccess('You have been successfully logged in'));
    //       dispatch(push('/'));
    //   })
    //   .catch((err) => {
    //     dispatch(loginError('Oops! Invalid username or password'));
    //   });
  };
}
