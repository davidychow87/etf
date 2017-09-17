import { combineReducers } from 'redux';
import * as types from '../../types';
import db from '../../indexeddb/db';
import moment from 'moment';
import { maxPoints } from '../../../config/app';

const initialState = {
  gettingSeries: false,
  series: [],
}

function previousAvailableDate(date) {
  if(this[date]) {
    return date;
  }
  let prevDate = moment(date, 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD');
  return previousAvailableDate.bind(this)(prevDate);
}

function nextAvailableDate(date) {
  if(this[date]) {
    console.log('RETURNING DATfE', date);
    return date;
  }
  //add a day
  let nextDate = moment(date, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
  return nextAvailableDate.bind(this)(nextDate);
}

function seriesArray(series, seriesType) {
  //only 5 out of 7 days a week (on avg)
  let adjustedMax = Math.round(1.45*maxPoints);
  console.log('AdustedMax', adjustedMax)
  let data = series.data;
  let today = moment().format("YYYY-MM-DD");
  let firstDate = moment(today).subtract(880, 'days').format("YYYY-MM-DD");
  // let firstDate = nextAvailableDate.bind(data)("1999-12-28");
  let diffDays = moment(today).diff(moment(firstDate), 'days');
  let daysPerPoint = Math.ceil(diffDays/adjustedMax);
  let remainder = Math.round((diffDays % adjustedMax));
  // let remainder = Math.round(maxPoints - ((diffDays/1.45)/daysPerPoint));
  let skipDays = Math.round(maxPoints/remainder); //+1 day every skipdays
  let day = firstDate;
  let dataArray = [];
  console.log('FirstDay', firstDate);
  console.log('today', today);
  console.log('diffdays', diffDays);
  console.log('dajMax', adjustedMax);
  console.log('remainder', remainder);
  console.log('DaysPerPoint', daysPerPoint);
  console.log('Skip', skipDays);
  console.log('DAYS Differe', diffDays);
  console.log('DATA', data);
  let count = 0;
  //get list of days
  while (moment(day) <= moment(today)) {
    let daysToSkip = daysPerPoint;
    // if (count === skipDays) {
    //   daysToSkip--;
    //   count = 0;
    // }
    // console.log('DaysToSkip', daysToSkip);
  
    if (data[day]) {
      let obj = { ...data[day] };
      obj.date = day;
      dataArray.push(obj);
    }
    count++;
    day = moment(day).add(daysToSkip, 'day').format('YYYY-MM-DD');
  }
  console.log('Prev dataArray length', dataArray.length);
  let lastDay = dataArray[dataArray.length-1].date;
  
  //if not last daty, add to dataArray
  if(lastDay !== today) {
    if (data[today]) {
      console.log('Adding today', lastDay, today);
      let obj = { ...data[today] };
      obj.date = today;
      dataArray.push(obj);
    } else {
      let previousDate = previousAvailableDate.bind(data)(today);
      let obj = { ...data[previousDate] };
      obj.date = previousDate;
      dataArray.push(obj);
    }
  }


  console.log('dateArray', dataArray.length);
  console.log('realArray', dataArray);


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
          seriesArray(series[0], seriesType);
          return {
            ...state,
            gettingSeries: false,
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
