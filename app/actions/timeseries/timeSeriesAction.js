import * as types from '../../types';
import ajax from '../../../utils/ajax';
import axios from 'axios';
import {alphaVantageKey, alphaVantageUrl, maxPoints, minuteIncrement} from '../../../config/app';
import querystring from 'querystring';
import db from '../../indexeddb/db';
import moment from 'moment';

const typeMap = {
  series: 'TIME_SERIES_DAILY',
}

function getTimeSeries() {
  return { type: types.GET_TIME_SERIES }
}

function getTimeSeriesSuccess(data, seriesType) {
  return { type: types.GET_TIME_SERIES_SUCCESS, data, seriesType }
}

function getTimeSeriesFail(response) {
  return { type: types.GET_TIME_SERIES_FAIL }
}

export function getTimeSeriesData(stock, type) {
  let seriesType = type ? typeMap[type] : 'TIME_SERIES_DAILY';
  let name = `${stock}-${seriesType}`;

  return (dispatch) => {
    dispatch(getTimeSeries());

      //fits check if the stock exists
    db.series.where('name').equals(name).toArray()
    .then(result => {
      if (result.length > 0) {
        // console.log('FOUND RESULT IS', result);
        // let lastUpdated = moment(stock[0].lastUpdated).utc();
        let now = moment().utc();

        // let diff = now.diff(lastUpdated, 'seconds');
        // if (diff < 3600) {
        //     console.log('not hor')
        // }
        // console.log('result', result);
      }
     
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
          dispatch(getTimeSeriesSuccess(data, seriesType));
        })
        .catch(err => {
          console.log('err', err);
          dispatch(getTimeSeriesFail(err));
        })
    });
  }
}
