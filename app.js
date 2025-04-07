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
const signupRoutes = require('./routes/signup');

const MONGODB_URI = 'mongodb+srv://NodeMongo:node-mongo-integration@node-mongo-integration.025ge.mongodb.net/shop?w=majority&appName=Node-Mongo-Integration';
const store = new mongodbSessionStore({uri: MONGODB_URI, collection: 'sessions'});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'this is the most secret property to be set inorder to attain high security', saveUninitialized: false, resave: false, store: store}));

// Implementing the below middleware function in order to avoid the errors for the missing functionality of mongoose magic methods by the express-session.
// Because, the express-session is not aware of getting the mongoose provided methods along with the session information from the database. 
app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id).then(
    user => {
      req.user = user;
    }
  ).catch(err => {
    console.log(err);
  });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(signupRoutes);

app.use(errorController.get404);

// Integration with the client and listening to the port.
// mongoConnect(() => {
//   app.listen(3000);
// })

// Connecting the mongoose package to the mongoDb to make use of ODM(Object Document Mapping) concept.
// This bascially takes care of all the heavy lifting behind the scenes to create the collections & documents to store the data.
mongoose.connect(MONGODB_URI).then(result => {
  // User.findOne().then(user => {
  //   if(!user){
  //     const user = new User({
  //       name: 'Sai',
  //       email: 'sai@test.com',
  //       cart: {
  //         items: []
  //       },
  //     });
  //     user.save();
  //   }
  // });
  app.listen(3000);
})
.catch(err => {
  console.log(err);
})


// const path = require('path');

// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const session = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);

// const errorController = require('./controllers/error');
// const User = require('./models/user');

// const MONGODB_URI = 'mongodb+srv://NodeMongo:node-mongo-integration@node-mongo-integration.025ge.mongodb.net/shop?w=majority&appName=Node-Mongo-Integration';

// const app = express();
// const store = new MongoDBStore({
//   uri: MONGODB_URI,
//   collection: 'sessions'
// });

// app.set('view engine', 'ejs');
// app.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
// const authRoutes = require('./routes/auth');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(
//   session({
//     secret: 'my secret',
//     resave: false,
//     saveUninitialized: false,
//     store: store
//   })
// );

// app.use((req, res, next) => {
//   if (!req.session.user) {
//     return next();
//   }
//   User.findById(req.session.user._id)
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// });

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
// app.use(authRoutes);

// app.use(errorController.get404);

// mongoose
//   .connect(MONGODB_URI)
//   .then(result => {
//     User.findOne().then(user => {
//       if (!user) {
//         const user = new User({
//           name: 'Max',
//           email: 'max@test.com',
//           cart: {
//             items: []
//           }
//         });
//         user.save();
//       }
//     });
//     app.listen(3000);
//   })
//   .catch(err => {
//     console.log(err);
//   });
