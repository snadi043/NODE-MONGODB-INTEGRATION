const path = require('path');

const fs = require('fs');

const express = require('express');

const bodyParser = require('body-parser');

const multer = require('multer'); // Multer is the package that handles the data in the form of the file/files from the body by injecting a object into the request.

const session = require('express-session');

const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);

const csrf = require('csurf');

const flash = require('connect-flash');

// Helmet is the package which provides additional security by setting the response headers in the application. 
const helmet = require('helmet'); 

// Compression is the packge which provides the functionality to minimize the file sizes in the application. 
// This functionality is usually provided by hosting providers, if not then consider using it.
const compression = require('compression'); 

// Morgan is the package useful to log the request being called by the client to the server in our application with other useful information.
// This functionality is usually provided by hosting providers, if not then consider using it.
const morgan = require('morgan');

const errorController = require('./controllers/error');

const User = require('./models/user');

console.log(process.env.NODE_ENV);

// const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@node-mongo-integration.025ge.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
const MONGODB_URI = `mongodb+srv://NodeMongo:NOdeMOngoDB@node-mongo-integration.025ge.mongodb.net/shop`

const csrfToken = csrf(); // Initializing the CSRF token to use in the application.

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'session'
});

// Configuring multer to handle the filename and filepath in the codebase.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const imageName = new Date().toISOString() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + imageName);
  }
});

// Configuring multer to handle what type of files (format) to be uploaded in the application.
const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
    cb(null, true);
  }
  else{
    cb(null, false);
  }
}

app.set('view engine', 'ejs');
app.set('views', 'views');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(helmet()); // Configuring the helmet middleware to trigger it for every api call in the application.
app.use(compression()); // Configuring the compression middleware to trigger it for "js & css" files in the application.
app.use(morgan('combined', {stream: accessLogStream}));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const signupRoutes = require('./routes/signup');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer({storage: storage, fileFilter: fileFilter}).single('image')); // Configuring multer package to store the images in the application.

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use(require('express-session')({
  secret: 'my secret',
  store: store,
  resave: false,
  saveUninitialized: false,
}));

app.use(csrfToken);

app.use(flash());

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
    .catch(err => {
      throw new Error(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(signupRoutes);

app.use('/500', errorController.get500);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(process.env.PORT || 3000);
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

