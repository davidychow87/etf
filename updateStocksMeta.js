var stocksMeta = require('./server/db/mongo/models/stocksMeta');
var csv = require('fast-csv');
var fs = require('fs');

var stream = fs.createReadStream('./data/amex.csv');

var csvStream = csv()
    .on('data', function(data) {
        // console.log('Data!', data);
        var symbol = data[0] ? data[0] : null;
        var name = data[1] ? data[1] : null;
        var marketCap = data[3];
        var ipoYear = data[5];
        var sector = data[6];
        var industry = data[7];
        
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
            console.log('Saved Data for: ', symbol);
          })
      

    })
    .on('end', function(data) {
        console.log('end')
    });

stream.pipe(csvStream);

