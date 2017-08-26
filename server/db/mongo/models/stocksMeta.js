// import mongoose from 'mongoose';
var mongoose = require('mongoose')
var stocksMetaSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  marketCap: String,
  ipoYear: String,
  sector: String,
  industry: String,
});

var stocksMeta = mongoose.model('StocksMeta', stocksMetaSchema);
// export default mongoose.model('StocksMeta', stocksMetaSchema);
module.exports = stocksMeta;
