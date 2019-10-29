const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParsor = require('body-parser');
const passport = require('passport');
var cors = require('cors');
const keys = require('./config/keys');

//require only
require('./models/User');
require('./models/UserProfile');
require('./models/PrivateMessage');


// BookModels
require('./models/BookstoreModels/Book');
require('./models/BookstoreModels/Bookreview');
require('./models/BookstoreModels/Bookstore');

// BlogModels
require('./models/BlogModels/BlogPost');
require('./models/BlogModels/BlogCategory');
require('./models/BlogModels/BlogReply');

// GritModels
require('./models/GritModels/Grit');

//CommonModels
require('./models/CommonModels/MailLog');

//StudyModels
require('./models/StudyModels/Study');
require('./models/StudyModels/StudyPost');
require('./models/StudyModels/StudyPostReply');
require('./models/StudyModels/StudyAssignment');

//passport
require('./services/passport');

// //connect the database
// //Mysql Database Access
// var mysql = require('mysql');

// var connection = mysql.createConnection({
//   host     : keys.RDS_HOSTNAME,
//   user     : keys.RDS_USERNAME,
//   password : keys.RDS_PASSWORD,
//   port     : keys.RDS_PORT
// });

// connection.connect(function(err) {
//   if (err) {
//     console.error('Database connection failed: ' + err.stack);
//   } else {
//     console.log('Connected to database.');
//     }
// });

mongoose.connect(keys.mongoURI);

const app = express();

app.use(cors());

app.use(function (req, res, next) {
    var newURL;
  
    // If not on HTTPS, or not on the main domain, redirect
    if (process.env.NODE_ENV === 'production' &&
      (req.headers['x-forwarded-proto'] !== 'https')) {
  
        newURL = ['https://www.mkeyword.com', req.url].join('');
      return res.redirect(newURL);
    }
  
    return next();
});


var allowedOrigins = ['http://localhost:5000','http://localhost:3000', 'https://cloud.mkeywordtester.com'];

app.use(cors({
    origin: function(origin, callback){
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));
app.use(bodyParsor.json());

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,    //30 days, 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
        keys: [keys.cookieKey],
        name: 'session'
    })
);

app.use(passport.initialize());
app.use(passport.session());

//Server Route
require('./routes/mainRoutes')(app);
require('./routes/authRoutes')(app);
require('./routes/bookstoreRoutes')(app);
require('./routes/blogRoutes')(app);
require('./routes/gritRoutes')(app);
require('./routes/awsRoutes')(app);
require('./routes/studyRoutes')(app);
require('./routes/apiRoutes')(app);


//Client Side Route
if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    // Like our main.js file, or main.css file!
    app.use(express.static('client/build'));

    // Express will serve up the index.html file
    // if it doesn't recognize the route;
    const path = require('path');
    app.get('*', (req, res)=> {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT);