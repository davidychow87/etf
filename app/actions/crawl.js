import * as types from '../types';
import ajax from '../../utils/ajax';

function beginCrawl() {
  return { type: types.BEGIN_CRAWL };
}

export function beginCrawl() {
  return (dispatch) => {
    return dispatch(beginCrawl(call));

  };
}
