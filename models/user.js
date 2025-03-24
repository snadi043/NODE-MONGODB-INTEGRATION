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

  getCart(){
    const db = getDb();
    const productIds = this.cart.items.map(i => { 
      return i.productId;
  });
    return db.collection('products').find({_id: {$in: productIds}}).toArray()
    .then(products => {
      return products.map(p => {
        return {
          ...p, quantity: this.cart.items.find(i => {
            return i.productId.toString() === p._id.toString();
          })
        }
      });
    });
  }

  deleteCartProductById(productId){
    const db = getDb();
    const updatedCartItems = this.cart.items.filter(products => {
      return products.productId.toString() !== productId.toString();
    })
    return db.collection('users').updateOne({_id: new Object(this._id)}, {$set: {cart: {items: updatedCartItems}}});
  }

  addOrders(){
    const db = getDb();
    // Getting the access to the products to disply in the orders.
    return this.getCart().then(products => {
      // Getting the access to the users information in the orders while adding an order to the collection.
      const orders = {
        items: products,
        users: {
          _id: new ObjectId(this._id),
          name: this.name
        }
      };
      return db.collection('orders').insertOne(orders);
    })
    .then(result => {
        this.cart = {items: []};
        return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart:{items: []}}});
      })
  }

  getOrders(){
    const db = getDb();
    return db.collection('orders')
    .find({'users._id' : new ObjectId(this._id)}) // finding the properties within the collections in the find() method provided by mongoDb using the ''.
    .toArray();
  }
}

module.exports = Users;