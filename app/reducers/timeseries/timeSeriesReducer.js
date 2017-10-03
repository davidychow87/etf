import { combineReducers } from 'redux';
import * as types from '../../types';
import db from '../../indexeddb/db';
import moment from 'moment';
import { maxPoints } from '../../../config/app';
import Promise from 'bluebird'

const initialState = {
  gettingSeries: false,
  series: {  },
}

function previousAvailableDate(date) {
  if(this[date]) {
    return date;
  }
  let prevDate = moment(date, 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD');
  return previousAvailableDate.bind(this)(prevDate);
}

function nextAvailableDate(date) {
  let today = moment().format("YYYY-MM-DD");

  if(this[date]) {
    return date;
  }

  if (moment(date) >= moment(today)) {
    return null;
  }

  //add a day
  let nextDate = moment(date, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
  return nextAvailableDate.bind(this)(nextDate);
}

function getInterval(range) {
  console.log('Range is', range);
  if (range >= 3650) return { interval: 'months', add: 1, startOf: 'month'};

  if (2555 <= range && range < 3650) return { interval: 'weeks', add: 2, startOf: 'week'};  

  if ((1095 <= range && range < 2555)) return { interval: 'weeks', add: 1, startOf: 'week'};

  if (range < 1095) return { interval: 'days', add: 1, startOf: 'day'};

  return { interval: 'weeks', add: 1, startOf: 'week'};
}

// //pass just data not series
function toSeriesArray(data, start, end) {
  let today = moment().format("YYYY-MM-DD");
  let startDate = start ? nextAvailableDate.bind(data)(start) : nextAvailableDate.bind(data)("1999-12-28");
  let endDate = end ? previousAvailableDate.bind(data)(end) : previousAvailableDate.bind(data)(today);
  let range = moment(endDate).diff(moment(startDate), 'days');
  let interval = getInterval(range);
  let day = startDate;
  let dataArray = [];
 
  while (moment(day) < moment(endDate)) {
    if (data[day]) {
      let obj = { ...data[day] };
      obj.date = day;
      dataArray.push(obj);
    }
    // day =  moment(day).add(interval.add, interval.interval).startOf(interval.startOf).format('YYYY-MM-DD');
    day = nextAvailableDate.bind(data)(moment(day).add(interval.add, interval.interval).startOf(interval.startOf).format('YYYY-MM-DD'));
  }
  console.log('Lenth of data', dataArray.length, "start", startDate);
  return dataArray;
}

export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
    case types.GET_TIME_SERIES:
      return {
        ...state,
        gettingSeries: true,
      };

    case types.GET_TIME_SERIES_SUCCESS:
      let stock = action.data.data['Meta Data']['2. Symbol'];
      let oldSeries = action.data.data['Time Series (Daily)'];
      let timeSeries = {};
      let seriesType = action.seriesType;
      let name = `${stock}-${seriesType}`;

      for (let date in oldSeries) {
        let tempObj = {};
        tempObj['open'] = oldSeries[date]['1. open'];
        tempObj['high'] = oldSeries[date]['2. high'];
        tempObj['low'] = oldSeries[date]['3. low'];
        tempObj['close'] = oldSeries[date]['4. close'];
        tempObj['volume'] = oldSeries[date]['5. volume'];
        timeSeries[date] = tempObj;
      }

      db.series.update(name, {
        name,
        data: timeSeries,
        lastUpdated: moment().format(),
      })
        .then((updated) => {
          //If nothing is updated, add it then return the aray
          if (!updated) {
            return db.series.add({
              name,
              data: timeSeries,
              lastUpdated: moment().utc().format()
            })
            .then(() => {
              console.log('Not updated');
              return db.series.where('name').equals(name).toArray();
            });
          } else {
            console.log('updated');
            return db.series.where('name').equals(name).toArray();
          }
        })
        .then(series => {
          // console.time('series');
          let formattedSeriesData = toSeriesArray(series[0].data);
          // console.timeEnd('series');
          // console.log('stateSeries', state.series);
          let tempSeries = { ...state.series };
          tempSeries[stock] = formattedSeriesData;
          console.log('seriestemp', tempSeries);
          return {
            ...state,
            gettingSeries: false,
            series: tempSeries,
          };
        })
        .catch(err => {
          console.log('Error with getting series', err);
          return {
            ...state,
            gettingSeries: false,
          };
        })

    case types.GET_TIME_SERIES_FAIL:
      return {
        ...state,
        gettingSeries: false
      };

    default:
      return state;
  }
}
