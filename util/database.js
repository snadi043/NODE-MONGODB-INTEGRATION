// Importing the installed MongoDB pacakge to use in the application to integrate with the database.
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; //Configuring MongoClient to connect to mongoDB.

// Inorder to use the connection process as a reusable code, calling it with a method to export it and use in the application.
const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://NodeMongo:node-mongo-integration@node-mongo-integration.025ge.mongodb.net/?retryWrites=true&w=majority&appName=Node-Mongo-Integration')
  .then(client => {
    callback(client);
    console.log('Connected!');
  })
  .catch(err => {console.log(err)});
}
// Exporting the connection process.
module.exports = mongoConnect;