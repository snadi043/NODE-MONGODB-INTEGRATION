const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const session = require('express-session');
const mongodbSessionStore = require('connect-mongodb-session')(session);

//Importing the method to listen to the localhost and run the node application.
// const mongoConnect = require('./util/database').mongoConnect;

const User = require('./models/user');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const MONGODB_URI = 'mongodb+srv://NodeMongo:node-mongo-integration@node-mongo-integration.025ge.mongodb.net/shop?w=majority&appName=Node-Mongo-Integration';
const store = new mongodbSessionStore({uri: MONGODB_URI, collection: 'sessions'});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'this is the most secret property to be set inorder to attain high security', saveUninitialized: false, resave: false, store: store}));

app.use((req, res, next) => {
  User.findById('67e2bad2ede014c342373de4')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// Integration with the client and listening to the port.
// mongoConnect(() => {
//   app.listen(3000);
// })

// Connecting the mongoose package to the mongoDb to make use of ODM(Object Document Mapping) concept.
// This bascially takes care of all the heavy lifting behind the scenes to create the collections & documents to store the data.
mongoose.connect(MONGODB_URI).then(result => {
  User.findOne().then(user => {
    if(!user){
      const user = new User({
        name: 'Sai',
        email: 'sai@test.com',
        cart: {
          items: []
        },
      });
      user.save();
    }
  });
  app.listen(3000);
})
.catch(err => {
  console.log(err);
})