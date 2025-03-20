// Importing the installed MongoDB pacakge to use in the application to integrate with the database.
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; //Configuring MongoClient to connect to mongoDB.

let _db;

// Inorder to use the connection process as a reusable code, calling it with a method to export it and use in the application.
const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://NodeMongo:node-mongo-integration@node-mongo-integration.025ge.mongodb.net/shop?retryWrites=true&w=majority&appName=Node-Mongo-Integration') //shop is the database name.
  .then(client => {
    _db = client.db();
    callback();
    console.log('Connected!');
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
}

// Storing the access to the database to efficently use the database connection.
const getDb = () => {
  if(_db){
    return _db;
  }
  throw 'No database connection found';
}

// Exporting the connection process.
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;