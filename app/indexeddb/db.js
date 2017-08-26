import Dexie from 'dexie';

const db = new Dexie('StocksTableDB');

db.version(1).stores({
  series: "++id,stock,data,lastUpdated"
});

export default db;
