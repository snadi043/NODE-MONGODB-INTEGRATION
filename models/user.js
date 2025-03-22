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
    const updatedCart = {items: [{ productId: new Object(product._id), quantity: 1}]};
    const db = getDb();
    return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}});
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
