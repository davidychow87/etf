'use strict';

import {alphaVantageKey, alphaVantageUrl, maxPoints, minuteIncrement} from '../../config/app';
import r from 'request';
import Promise from 'bluebird';
import querystring from 'querystring';
let request = Promise.promisify(r);
import moment from 'moment';
import fs from 'fs';      
import path from 'path';
import stocksMeta from '../db/mongo/models/stocksMeta';
import csv from 'fast-csv';

function determineInterval(start, end) {
  let timeSeries;
  let startDate = moment(start, "YYYY-MM-DD");
  let endDate = moment(end, "YYYY-MM-DD");
  let days = endDate.diff(startDate, 'days');
  //# points per day based on minuteIncrement - 1440 min/day
  let perDay = 1440/minuteIncrement;
  //max num of intra days
  let maxIntraDays = maxPoints/perDay
  let div = days/maxPoints;

  if(days <= maxIntraDays) {
    return 'TIME_SERIES_INTRADAY';
  }

  if (div <= 1) {
    return 'TIME_SERIES_DAILY';
  }

  if (div <= 7) {
    return 'TIME_SERIES_WEEKLY';
  }

  return 'TIME_SERIES_MONTHLY';
}

let intervalMap = {
  'TIME_SERIES_INTRADAY': `Time Series (${minuteIncrement}min)`,
  'TIME_SERIES_DAILY': 'Time Series (Daily)',
  'TIME_SERIES_WEEKLY': 'Weekly Time Series',
  'TIME_SERIES_MONTHLY': 'Monthly Time Series'
};

function cache(req, res, next) {
  console.time('cacheTime');
  // let dataArray = [];
  // let start = moment(req.params.start, 'YYYY-MM-DD');
  // let end = moment(req.params.end, 'YYYY-MM-DD');

  fs.readdir('./temp', (err, files) => {
    if(err) {
      console.log("ERROR", err);
    }
    let name = `${req.params.symbol}.json`;

    console.log("FILES", files);
    if (files.includes(name)) {
      console.log("here");
      let obj = JSON.parse(fs.readFileSync(`./temp/${name}`, 'utf8'));

      // console.log("next date?!?!", nextDate);
      console.timeEnd('cacheTime');
      res.status(200).send(obj);
    } else {
      next();
    }


  })
}


//start/end should be YYYY-MM-DD
// let monthlyInterval = async (data, start, end) => {
//   let monthArray = [];
//   let series = data.series;
//   // console.log('series', series);
//   let nextAvailableDate = async (date) => {
//     if (this[date]) {
//       console.log("FOUND DATE", date);
//       return date;
//     } else {
//       let nextDate = moment(date, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
//       console.log("NextDate", nextDate);
//       nextAvailableDate.bind(this)(nextDate);
//     }
//   };
//
//   let showDate = await nextAvailableDate.bind(series);
//   let dated = showDate(start);
//   console.log("dated!!", dated);
//   return dated;
//
// };

let nextAvailableDate = function(date) {
  console.log("Current date", date);
  // if(moment(date, 'YYYY-MM-DD') >= moment().startOf('day')) {
  //   console.log("greater than", date);
  //   return date;
  // }
   if (this[date]) {
    console.log("returning date", date, this[date]);
    return 'fuck';
   }
    let nextDate = moment(date, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');

    nextAvailableDate.bind(this)(nextDate);

};

let monthlyInterval = (data, start, end) => {
  return new Promise((resolve, reject) => {
    let showDate2;
      let monthArray = [];
      let series = data.series;

      let showDate = nextAvailableDate.bind(series);
      // let show1 = showDate(start);
      // console.log('show1', show1);
      // let show2 = showDate('1999-12-27');

      console.log("showdate22", showDate('1999-12-28'));
      setTimeout(function() {
        resolve('done');
      }, 10000)


  });
}

export default function(app) {

  //gets (or cache full data)
  app.get('/stocks/series/:symbol', cache, (req, res) => {
    console.time('reqTime');

    let qs = querystring.stringify({
      function: 'TIME_SERIES_DAILY',
      symbol: req.params.symbol,
      outputsize: 'full',
      apikey: alphaVantageKey,
    });

    let uri = `${alphaVantageUrl}?${qs}`;
console.log("URI", uri);
    return request({
      uri: uri,
      method: 'GET',
    })
      .then((result) => {
        if (result[0].statusCode !== 200) {
          res.status(400).send({success: false});
        }

        let data = result[1] ? JSON.parse(result[1]) : {};
        // delete data['Meta Data'];
        data['meta'] = {};
        data['meta'].symbol = req.params.symbol;
        data['meta'].lastUpdated = moment().format();
        data['series'] = {};
        let oldSeries = data['Time Series (Daily)'];
        let newSeries = {};
        for (let date in oldSeries) {
          let tempObj = {};
          tempObj['open'] = oldSeries[date]['1. open'];
          tempObj['high'] = oldSeries[date]['2. high'];
          tempObj['low'] = oldSeries[date]['3. low'];
          tempObj['close'] = oldSeries[date]['4. close'];
          tempObj['volume'] = oldSeries[date]['5. volume'];
          newSeries[date] = tempObj;
        }
        data['series'] = newSeries;
        delete data['Time Series (Daily)'];


        fs.writeFile(`./temp/${req.params.symbol}.json`, JSON.stringify(data, null, 4), 'utf-8', function(err) {
          if(err) {
            console.log("Err", err);
          }
          console.log("DONE");
        })


        console.timeEnd('reqTime');
        res.status(200).send({result: result[1]});
      });
  });

  app.get('/stocks/find/:stock', (req, res) => {
    let stock = req.params.stock;
console.log('Looking for stock', stock);
    stocksMeta.find({ sector: 'Health Care' }, (err, result) => {
      console.log('RESULT dSS', result);
    })

  });

  app.post('/stocks/test/route', (req, res) => {
    // console.log('in route', res.send);
    console.log('body is', req.body);
    res.status(200).send([1,2,3]);
  })

  app.get('/stocks/database/post', (req, res) => {
    //nasdaq, nyse
    var stream = fs.createReadStream('./data/amex.csv');
    let count = 0;
    var csvStream = csv()
        .on('data', function(data) {
            // console.log('Data!', data);

            //for amex
            var symbol = data[0] ? data[0] : null;
            var name = data[1] ? data[1] : null;
            var marketCap = data[3];
            var ipoYear = data[5];
            var sector = data[6];
            var industry = data[7];

            // var symbol = data[0] ? data[0] : null;
            // var name = data[1] ? data[1] : null;
            // var marketCap = data[3];
            // var ipoYear = data[5];
            // var sector = data[6];
            // var industry = data[7];

            if (symbol !== 'Symbol') {
              var newStock = new stocksMeta({
                name: name,
                symbol: symbol,
                marketCap: marketCap,
                ipoYear: ipoYear,
                sector: sector,
                industry: industry,
              });
          
              newStock.save((err) => {
                if(err) console.log('err');
                console.log('Saved Data for', count, symbol);
              });
              count++;
            }
        })
        .on('end', function(data) {
            console.log('end');
            setTimeout(() => {
              console.log('ending');
              return res.status(200).send({status: true});
            }, 2000)
            
        });
    
    stream.pipe(csvStream);

    

  });

  //start and end is YYYY-MM-DD
  app.get('/stocks/:symbol/:start/:end', cache, (req, res) => {
    console.time('reqTime');
    // let interval = determineInterval(req.params.start, req.params.end)
    //
    let qs = querystring.stringify({
      function: 'TIME_SERIES_DAILY',
      symbol: req.params.symbol,
      interval: `${minuteIncrement}min`,
      outputsize: 'full',
      apikey: alphaVantageKey,
    });

    let uri = `${alphaVantageUrl}?${qs}`;

console.log("URI", uri);

    return request({
      uri: uri,
      method: 'GET',
    })
      .then((result) => {
        if (result[0].statusCode !== 200) {
          res.status(400).send({success: false});
        }

        let savedData = {};
        let data = result[1] ? JSON.parse(result[1]) : {};
        let timeSeries = data['Time Series (Daily)'];
        // let points = data[intervalMap[interval]];

        let dataArray = [];
        let start = moment(req.params.start, 'YYYY-MM-DD');
        let end = moment(req.params.end, 'YYYY-MM-DD');

        while (end >= start) {
            let tempObj = {};

            if (timeSeries[start.format('YYYY-MM-DD')]) {
              tempObj['open'] = timeSeries[start.format('YYYY-MM-DD')]['1. open'];
              tempObj['high'] = timeSeries[start.format('YYYY-MM-DD')]['2. high'];
              tempObj['low'] = timeSeries[start.format('YYYY-MM-DD')]['3. low'];
              tempObj['close'] = timeSeries[start.format('YYYY-MM-DD')]['4. close'];
              tempObj['volume'] = timeSeries[start.format('YYYY-MM-DD')]['5. volume'];
              tempObj['date'] = start.format('YYYY-MM-DD');

              dataArray.unshift(tempObj);
            }

            start.add(1, 'day');
        }

        savedData['meta'] = {};
        savedData['meta']['symbol'] = req.params.symbol;
        savedData['meta']['lastSaved'] = moment().format();
        savedData['series'] = dataArray;


        fs.writeFile(`./temp/${req.params.symbol}.json`, JSON.stringify(savedData, null, 4), 'utf-8', function(err) {
          if(err) {
            console.log("Err", err);
          }
          console.log("DONE");
        })


        console.timeEnd('reqTime');
        res.status(200).send({result: savedData});
      });
  });

  app.get('/stocks/suggestions', (req, res) => {
    let value = req.query.value.trim().toUpperCase();
    stocksMeta.find({ symbol: new RegExp(`^${value}`) }, (err, result) => {
        res.status(200).send({ suggestions: result });
    })
  });

}
