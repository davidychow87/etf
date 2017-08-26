var rp = require('request-promise');
var cheerio = require('cheerio');
var Horseman = require('node-horseman');
var phantomjs = require('phantomjs');
var horseman = new Horseman();

horseman
  .open('https://www.etf.com/voo')
  .wait(4000)
  .html()
  .then(function(body) {
    console.log("ODY", body);
    return horseman.close();
  });

  // horseman
  //   .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
  //   .open('http://mravi.me')
  //   .click('.post-title a')
  //   .waitForNextPage()
  //   .title()
  //   .plainText('.post-content')
  //   .log() // prints out the number of results
  //   .close();

// let options = {
//   uri: 'https://www.etf.com/VOO',
//   transform: function(body) {
//     return cheerio.load(body);
//   }
// }
//
// request('https://www.etf.com/VOO', function(error, response, body) {
//   console.log("BODAY", body);
// })

// rp(options)
//   .then(function(res) {
//     let $ = res;
//     let segment = $('.field-content').html();
//     console.log("Segment", segment, typeof segment);
//
//     // $('#form-reports-overview').each(function(i, elem) {
//     //   console.log(i, "elelm", $(this).text());
//     // });
//
//       // console.log("Sectors", $('#form-reports-overview').find('div.generalChartBox').next().html());
//
// $('#form-reports-overview').find('div.generalChartBox').each(function(i) {
//   console.log("num", i, $(this).find('ul').text());
// })

  // });
