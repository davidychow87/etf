import { combineReducers } from 'redux';
import * as types from '../types';
import db from '../indexeddb/db';
import moment from 'moment';

const initialState = {
  gettingSeries: false,
}

export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
    case types.GET_TIME_SERIES:
      return {
        ...state,
        gettingSeries: true,
      };

    case types.GET_TIME_SERIES_SUCCESS:
    console.log('DATA', action.data)
      let stock = action.data.data['Meta Data']['2. Symbol'];
      let oldSeries = action.data.data['Time Series (Daily)'];
      let timeSeries = {}

      for (let date in oldSeries) {
        let tempObj = {};
        tempObj['open'] = oldSeries[date]['1. open'];
        tempObj['high'] = oldSeries[date]['2. high'];
        tempObj['low'] = oldSeries[date]['3. low'];
        tempObj['close'] = oldSeries[date]['4. close'];
        tempObj['volume'] = oldSeries[date]['5. volume'];
        timeSeries[date] = tempObj;
      }

      db.series.add({
        stock: stock,
        data: timeSeries,
        lastUpdated: moment().format()
      })
        .then(() => {
          // console.log('Datum', datum);
          return db.series.where('stock').equals('MSFT').toArray();
        })
        .then(lol => {
          console.log('here', lol);
        })


      return {
        ...state,
        gettingSeries: false,
      };

    case types.GET_TIME_SERIES_FAIL:
      return {
        ...state,
        gettingSeries: false
      };

    default:
      return state;
  }
}
