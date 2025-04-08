const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const session = require('express-session');

const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);


const csrf = require('csurf');

const errorController = require('./controllers/error');
const User = require('./models/user');

// 
const MONGODB_URI = 'mongodb+srv://NodeMongo:node-mongo-integration@node-mongo-integration.025ge.mongodb.net/shop?w=majority&appName=Node-Mongo-Integration';

const csrfToken = csrf(); // Initializing the CSRF token to use in the application.

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'session'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const signupRoutes = require('./routes/signup');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  secret: 'my secret',
  store: store,
  resave: false,
  saveUninitialized: false,
}));

app.use(csrfToken);

// Middleware function to use the properties in all the views to implement them in the 
// format of "locals" which has the centralized memory to access and use them in the application.
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(signupRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });


  // CSRF -> CSRF stands for Cross Site Request Frogery.
  // CSRF is an attack made by the hackers to inject malicious code into the application and tricking the users of the application to perform sensitive information related actions.
  // Scenario: A user is logged in into the application who has valid session and cookie accessing the application, is directed to use a similar looking view (which is not the actual authorized view) to then fill a form or do a payment.
  // This can also happen in a way where an email with a link is sent asking to navigate to the link to perform verification then redirects to similar looking view and manipulates to perform sensitive actions.
  // But, how is this flow working, Because the user has a valid session and that session has access to the server which makes it accessible to handle the above mentioned flow.
  // To overcome this scenario and avoid such attacks happening with your site, the work around is to implement the CSRF Token in the views of the application.
  // CSRF tokens function in a way where a hashed token is set on the neccessary HTTP request and is mapped with the related to view to make that view as a secure page to render for the users.
  // The package used to implement this flow is "CSURF". This package does not render the views which are not holding the token when handled through the POST HTTP methods.

// const path = require('path');

// const express = require('express');
// const bodyParser = require('body-parser');

// const mongoose = require('mongoose');

// const session = require('express-session');
// const mongodbSessionStore = require('connect-mongodb-session')(session);

// //Importing the method to listen to the localhost and run the node application.
// // const mongoConnect = require('./util/database').mongoConnect;

// const User = require('./models/user');

// const errorController = require('./controllers/error');

// const app = express();

// app.set('view engine', 'ejs');
// app.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
// const authRoutes = require('./routes/auth');
// const signupRoutes = require('./routes/signup');

// const MONGODB_URI = 'mongodb+srv://NodeMongo:node-mongo-integration@node-mongo-integration.025ge.mongodb.net/shop?w=majority&appName=Node-Mongo-Integration';

// const store = new mongodbSessionStore({uri: MONGODB_URI, collection: 'session'});

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({secret: 'this is the most secret property to be set inorder to attain high security', saveUninitialized: false, resave: false, store: store}));

// // Implementing the below middleware function in order to avoid the errors for the missing functionality of mongoose magic methods by the express-session.
// // Because, the express-session is not aware of getting the mongoose provided methods along with the session information from the database. 
// app.use((req, res, next) => {
//   if(!req.session.user){
//     return next();
//   }
//   User.findById(req.session.user._id).then(
//     user => {
//       req.user = user;
//     }
//   ).catch(err => {
//     console.log(err);
//   });
// });

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
// app.use(authRoutes);
// app.use(signupRoutes);

// app.use(errorController.get404);

// // Integration with the client and listening to the port.
// // mongoConnect(() => {
// //   app.listen(3000);
// // })

// // Connecting the mongoose package to the mongoDb to make use of ODM(Object Document Mapping) concept.
// // This bascially takes care of all the heavy lifting behind the scenes to create the collections & documents to store the data.
// mongoose.connect(MONGODB_URI).then(result => {
//   app.listen(3000);
// })
// .catch(err => {
//   console.log(err);
// });
