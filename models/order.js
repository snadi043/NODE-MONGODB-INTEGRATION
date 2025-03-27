const mongoose =  require('mongoose');

const Schema = mongoose.Schema;

const ordersSchema = new Schema({
  products: [{
    product:{
      type: Object,
      required: true,
    },
    quantity:{
      type: Number,
      required: true
    }
  }],
  user:{
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    name:{
      type: String,
      required: true,
    }
  }
});

module.exports = mongoose.model('Order', ordersSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Order = sequelize.define('order', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   }
// });

// module.exports = Order;
