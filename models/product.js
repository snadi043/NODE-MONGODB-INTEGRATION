// Importing the mongoose package to create the model.
const mongoose = require('mongoose');

// Importing the Schema to create the Schema for the model.
const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ref -> is the property which checks for the particular model to make use of that model and create a connection.
    required: true
  }
});

// Exporting the model to use it in the application which takes two arguments that is the name of the 
// model which is then replicated to the lowercase and plural form of it to create the collection with 
// that name and also takes schema name as the second argument.
module.exports = mongoose.model('Product', productSchema); 





// const mongodb = require('mongodb');

// const ObjectId = mongodb.ObjectId;

// const getDb = require('../util/database').getDb;

// class Product{
//   constructor(title, price, imageUrl, description, id, userId){
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this._id = id ? new ObjectId(id) : null;
//     this.userId = userId;
//   }

//   // Save() is the method to add the product to the database which is a post action.
//   save(){
//     const db = getDb();
//     let dbOp;
//     if(this._id){
//     // Update the exisiting document if the id is already existing in the database.
//       dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});
//     }
//     // Insert a new document if the id is not present in the database.
//     else{
//       dbOp = db.collection('products').insertOne(this) // insertOne is the mongoDB method to store the document/record into the database.
//     }
//     return dbOp
//     .then(result => {
//       console.log(result);
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }

//   // fetchAll() is the static method to get all the products from the database which is the get action.
//   static fetchAll(){
//     const db = getDb();
//     return db.collection('products').find().toArray()
//     //find() is the mongodb method to fetch all the documents from the database. 
//     //toArray() is the cursor/method which is used to pass a limited amount of documents/records while fetching from the database insetead of bulk. 
//     .then(products => {
//       return products;
//     })
//     .catch(err => {console.log(err)});
//   }

//   // findById() is the static method to get a particular products from the database which is the get action based on the filter added to the collection.
//   static findById(prodId){
//     const db = getDb();
//     return db.collection('products')
//     .find({_id: new ObjectId(prodId)}) // find() can take an object which can have the filters to sort the data based on the conditions.
//     .next() // next() is the cursor/method to forward the functionality of the method in the process of handling the data.
//     .then(product => {
//       return product;
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }

//   // deleteOne() is the static method to get a particular products from the database which is the get action based on the filter added to the collection.
//   static deleteById(prodId){
//     const db = getDb()
//     return db.collection('products')
//     .deleteOne({_id: new ObjectId(prodId)})
//     .then(product => {console.log(product)})
//     .catch(err => {console.log(err)});
//   }
// }

// module.exports = Product;
