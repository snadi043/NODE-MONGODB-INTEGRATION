// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const mongodb = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

const getDb = require('../util/database').getDb;


class Product{
  constructor(title, price, imageUrl, description){
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  // Save() is the method to add the product to the database which is a post action.
  save(){
    const db = getDb();
    return db.collection('products').insertOne(this) // insertOne is the mongoDB method to store the document/record into the database.
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
  }

  // fetchAll() is the static method to get all the products from the database which is the get action.
  static fetchAll(){
    const db = getDb();
    return db.collection('products').find().toArray()
    //find() is the mongodb method to fetch all the documents from the database. 
    //toArray() is the cursor/method which is used to pass a limited amount of documents/records while fetching from the database insetead of bulk. 
    .then(products => {
      return products;
    })
    .catch(err => {console.log(err)});
  }

  // findById() is the static method to get a particular products from the database which is the get action based on the filter added to the collection.
  static findById(prodId){
    const db = getDb();
    return db.collection('products')
    .find({_id: new ObjectId(prodId)}) // find() can take an object which can have the filters to sort the data based on the conditions.
    .next() // next() is the cursor/method to forward the functionality of the method in the process of handling the data.
    .then(product => {
      return product;
    })
    .catch(err => {
      console.log(err);
    });
  }
}


// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

module.exports = Product;
