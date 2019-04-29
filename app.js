const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const Grid = require('gridfs-stream');
const passport = require('passport');
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('./helpers/auth');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var name ;
var access;

const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

//DB config
const db = require('./config/database');


// Connect to mongoose
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true
})
  .then()
  .catch(err => console.log(err));

//for upload 
const conn = mongoose.createConnection(db.mongoURI,{ useNewUrlParser: true });

//initialize gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

//ejs middlewares
app.set('view engine', 'ejs');
app.set('views', 'views');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Index Route
app.get('/',ensureAuthenticated, (req, res) => {
  name = res.locals.user.name;
  access = res.locals.user.access;
  const title = 'Welcome'+" "+name;
  res.render('index', {
    title: title,
    name : name,
    access : access
  });
});

// Use routes
app.use('/users', users);
app.use('/admin', adminRoutes);

//for unknown pages
app.use(errorController.get404);

const port = process.env.PORT || 5000;

sequelize
  // .sync({ force: true })
  .sync()
  .then(cart => {
    app.listen(port, () =>{
      // console.log(`Server started on port ${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });