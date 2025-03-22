const mongoDB = require('mongodb');

const ObjectId = mongoDB.ObjectId;

const getDb = require('../util/database').getDb;

class Users{
  constructor(name, email, cart, id){
    this.name = name;
    this.email = email;
    this.cart = cart; // {items: [{}]}
    this._id = id;
  }
  save(){
    const db = getDb();
    return db.collection('users').insertOne(this);
  }
  static getUserById(userId){
    const db = getDb();
    return db.collection('users').findOne({_id: new ObjectId(userId)});
  }
  // addToCart() is the method which depends upon the userId and makes a relation between user and the cart.
  // Based on the userId, the cart gets the access to add the products.
  addToCart(product){
    // Cheking if the product is existing in the cart already in the collection by comparing the indexes
    const cartProdutIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items] // getting access to all the items in the cart so that they can be edited as per the conditions.
    // If the product is already existing then increase the quantity by 1.
    if(cartProdutIndex >= 0){
      newQuantity = this.cart.items[cartProdutIndex].quantity + 1; 
      updatedCartItems[cartProdutIndex].quantity = newQuantity;
    }
    // If it is new product then create a new object of the item with the product data and the quantity with the push() method.
    else{
      updatedCartItems.push({productId: new ObjectId(product._id), newQuantity});
    }
    // updatedCart is basically the format/schema of the cart that is to be stored in the users collection.
    // Finally always passing the information of the updatedCartItems to the updatedCart.
    const updatedCart = {items: updatedCartItems}; 
    const db = getDb(); // getting the access to the database connection.
    return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}})
  }
}

module.exports = Users;

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: Sequelize.STRING,
//   email: Sequelize.STRING
// });

// module.exports = User;
