import * as types from '../../types';
import ajax from '../../../utils/ajax';
import axios from 'axios';
import {alphaVantageKey, alphaVantageUrl, maxPoints, minuteIncrement} from '../../../config/app';
import querystring from 'querystring';

const typeMap = {
  series: 'TIME_SERIES_DAILY',
}

function getTimeSeries() {
  return { type: types.GET_TIME_SERIES }
}

function getTimeSeriesSuccess(data) {
  return { type: types.GET_TIME_SERIES_SUCCESS, data }
}

function getTimeSeriesFail(response) {
  return { type: types.GET_TIME_SERIES_FAIL }
}

export function getTimeSeriesData(stock, type) {
  let seriesType = typeMap[type];

  return (dispatch) => {
    dispatch(getTimeSeries());
    console.time('callStock');
    let qs = querystring.stringify({
      function: seriesType,
      symbol: stock,
      outputsize: 'full',
      apikey: alphaVantageKey,
    });

    return axios({
      method: 'GET',
      url: `${alphaVantageUrl}?${qs}`
    })
      .then(data => {
        console.timeEnd('callStock');
        dispatch(getTimeSeriesSuccess(data));
      })
      .catch(err => {
        console.log('err', err);
        dispatch(getTimeSeriesFail(err));
      })

  }
}
