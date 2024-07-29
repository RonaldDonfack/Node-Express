const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnet = callback => {
   MongoClient.connect('mongodb://localhost:27017/shop')
      .then(client => {
         console.log('Connected!');
         _db = client.db()
         callback();
      })
      .catch(err => {
         console.log("not connected " , err)
         throw err;
      })
}


const getDb = () => {
   if (_db) {
      return _db;
   }
   throw "No Database Found!";
}

exports.mongoConnet = mongoConnet;
exports.getDb = getDb;